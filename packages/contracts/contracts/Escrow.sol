// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol"; // Optional: If needed for tracking donors for refunds

/**
 * @title AidBlocksEscrow
 * @dev Manages donations for a specific aid campaign, releasing funds in milestones.
 * - Receives donations in a specific ERC20 token.
 * - Holds funds securely in escrow.
 * - Releases funds to the campaign owner based on milestone approvals triggered by a platform admin.
 * - Emits events for transparency and off-chain tracking.
 * - Implements AccessControl for role management (PLATFORM_ADMIN).
 * - Uses ReentrancyGuard to prevent reentrancy attacks.
 * - Uses SafeERC20 for safe token transfers.
 */
contract AidBlocksEscrow is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // --- Roles ---
    bytes32 public constant PLATFORM_ADMIN_ROLE = keccak256("PLATFORM_ADMIN_ROLE");

    // --- State Variables ---

    IERC20 public immutable token; // The accepted ERC20 donation token (e.g., USDC)
    address payable public immutable campaignOwner; // Address receiving the funds upon release

    struct Milestone {
        uint256 amountRequired; // Amount needed *for* this milestone's work (released after prior approval)
        bool isFunded; // Has the amount for this milestone been released to the owner?
        bool isApproved; // Has the *evidence* for completing this milestone been approved (signaled by admin)?
    }

    Milestone[] public milestones;
    uint256 public currentMilestoneIndex; // Tracks the *next* milestone expecting funding release

    uint256 public totalDonated; // Total amount of tokens donated to this contract
    uint256 public totalReleased; // Total amount of tokens released to the campaignOwner

    bool public isCompleted; // Flag indicating if all milestones are funded
    bool public isCancelled; // Flag indicating if the campaign was cancelled by the admin

    // Optional: Track donors for potential complex refund logic if needed later
    // using EnumerableSet for EnumerableSet.AddressSet;
    // EnumerableSet.AddressSet private donors;

    // --- Events ---

    /**
     * @dev Emitted when a donation is successfully received.
     * @param donor The address of the donor.
     * @param amount The amount of tokens donated.
     * @param totalDonated The new total amount donated to the campaign.
     */
    event DonationReceived(address indexed donor, uint256 amount, uint256 totalDonated);

    /**
     * @dev Emitted when the platform admin signals that a milestone's evidence has been approved off-chain.
     * @param milestoneIndex The index of the milestone approved.
     */
    event MilestoneApproved(uint256 indexed milestoneIndex);

    /**
     * @dev Emitted when funds for a milestone are successfully released to the campaign owner.
     * @param milestoneIndex The index of the milestone being funded.
     * @param recipient The address receiving the funds (campaignOwner).
     * @param amount The amount of tokens released.
     * @param totalReleased The new total amount released.
     */
    event FundsReleased(uint256 indexed milestoneIndex, address indexed recipient, uint256 amount, uint256 totalReleased);

    /**
     * @dev Emitted when all milestones have been successfully funded.
     */
    event CampaignCompleted();

    /**
     * @dev Emitted when the campaign is cancelled by the platform admin.
     */
    event CampaignCancelled();

     /**
     * @dev Emitted when remaining funds are withdrawn by the platform admin after cancellation/completion.
     * @param recipient The address receiving the remaining funds (platformAdmin).
     * @param amount The amount of tokens withdrawn.
     */
    event FundsWithdrawn(address indexed recipient, uint256 amount);


    // --- Constructor ---

    /**
     * @dev Sets up the escrow contract for a specific campaign.
     * @param _tokenAddress The address of the ERC20 token to accept for donations.
     * @param _campaignOwner The address that will receive funds when milestones are released.
     * @param _platformAdmin The address granted the PLATFORM_ADMIN_ROLE to approve milestones and manage the contract.
     * @param _milestoneAmounts An array containing the amount required for each milestone, in order.
     */
    constructor(
        address _tokenAddress,
        address payable _campaignOwner,
        address _platformAdmin,
        uint256[] memory _milestoneAmounts
    ) {
        require(_tokenAddress != address(0), "AidBlocksEscrow: Invalid token address");
        require(_campaignOwner != address(0), "AidBlocksEscrow: Invalid campaign owner address");
        require(_platformAdmin != address(0), "AidBlocksEscrow: Invalid platform admin address");
        require(_milestoneAmounts.length > 0, "AidBlocksEscrow: Must have at least one milestone");

        token = IERC20(_tokenAddress);
        campaignOwner = _campaignOwner;

        // Setup Access Control: Grant platform admin role and admin role to the designated admin
        _grantRole(DEFAULT_ADMIN_ROLE, _platformAdmin); // Admin can manage roles
        _grantRole(PLATFORM_ADMIN_ROLE, _platformAdmin); // Admin can approve milestones

        // Initialize milestones
        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            require(_milestoneAmounts[i] > 0, "AidBlocksEscrow: Milestone amount must be positive");
            milestones.push(Milestone({
                amountRequired: _milestoneAmounts[i],
                isFunded: false,
                isApproved: false
            }));
        }
    }

    // --- External Functions ---

    /**
     * @dev Allows users to donate tokens to the campaign.
     * Requires prior approval of the token transfer by the donor to this contract.
     * @param _amount The amount of tokens to donate.
     */
    function donate(uint256 _amount) external nonReentrant {
        require(!isCompleted, "AidBlocksEscrow: Campaign already completed");
        require(!isCancelled, "AidBlocksEscrow: Campaign cancelled");
        require(_amount > 0, "AidBlocksEscrow: Donation amount must be positive");

        // Update total donated *before* transfer for checks-effects-interactions
        totalDonated += _amount;

        // Optional: Track donor address if complex refunds needed later
        // donors.add(msg.sender);

        // Pull tokens from donor to this contract
        token.safeTransferFrom(msg.sender, address(this), _amount);

        emit DonationReceived(msg.sender, _amount, totalDonated);
    }

    /**
     * @dev Called by the platform admin to signal that the evidence for a specific milestone
     * has been verified and approved off-chain. This enables the release of funds for the *next* milestone.
     * @param _milestoneIndex The index of the milestone whose evidence is being approved.
     */
    function approveMilestoneEvidence(uint256 _milestoneIndex) external onlyRole(PLATFORM_ADMIN_ROLE) {
        require(!isCompleted, "AidBlocksEscrow: Campaign already completed");
        require(!isCancelled, "AidBlocksEscrow: Campaign cancelled");
        require(_milestoneIndex < milestones.length, "AidBlocksEscrow: Invalid milestone index");
        require(!milestones[_milestoneIndex].isApproved, "AidBlocksEscrow: Milestone already approved");

        // Ensure milestones are approved sequentially based on evidence submission
        // The approval of milestone N requires milestone N-1 to be approved first (if N > 0)
        require(_milestoneIndex == 0 || milestones[_milestoneIndex - 1].isApproved, "AidBlocksEscrow: Previous milestone not approved yet");

        milestones[_milestoneIndex].isApproved = true;

        emit MilestoneApproved(_milestoneIndex);

        // Note: This function *only* marks approval. A separate call releases funds.
    }


    /**
     * @dev Releases funds for the *current* milestone to the campaign owner.
     * Can only be called if the *previous* milestone's evidence has been approved (or if it's the first milestone).
     * This function should typically be called by the platform admin or a trusted keeper after checking conditions.
     */
    function releaseMilestoneFunds() external nonReentrant onlyRole(PLATFORM_ADMIN_ROLE) {
        require(!isCompleted, "AidBlocksEscrow: Campaign already completed");
        require(!isCancelled, "AidBlocksEscrow: Campaign cancelled");
        require(currentMilestoneIndex < milestones.length, "AidBlocksEscrow: All milestones already funded");

        Milestone storage current = milestones[currentMilestoneIndex];
        require(!current.isFunded, "AidBlocksEscrow: Current milestone already funded");

        // Check if the *previous* milestone is approved (required to release funds for the *current* one)
        // For the first milestone (index 0), this condition is bypassed.
        require(currentMilestoneIndex == 0 || milestones[currentMilestoneIndex - 1].isApproved, "AidBlocksEscrow: Previous milestone evidence not approved");

        uint256 amountToRelease = current.amountRequired;
        uint256 currentBalance = token.balanceOf(address(this));
        require(currentBalance >= amountToRelease, "AidBlocksEscrow: Insufficient funds in escrow for this milestone");

        // --- Checks-Effects-Interactions Pattern ---
        // Effects: Update state *before* the external call (transfer)
        current.isFunded = true;
        totalReleased += amountToRelease;
        uint256 milestoneIndexBeingFunded = currentMilestoneIndex; // Store before incrementing
        currentMilestoneIndex++;

        // Check for campaign completion
        if (currentMilestoneIndex == milestones.length) {
            isCompleted = true;
        }

        // Interaction: Transfer funds
        token.safeTransfer(campaignOwner, amountToRelease);

        emit FundsReleased(milestoneIndexBeingFunded, campaignOwner, amountToRelease, totalReleased);

        if (isCompleted) {
            emit CampaignCompleted();
        }
    }

    /**
     * @dev Allows the platform admin to cancel the campaign, preventing further donations and releases.
     * Remaining funds can then potentially be withdrawn by the admin for off-chain handling/refunds.
     */
    function cancelCampaign() external onlyRole(PLATFORM_ADMIN_ROLE) {
        require(!isCompleted, "AidBlocksEscrow: Cannot cancel a completed campaign");
        require(!isCancelled, "AidBlocksEscrow: Campaign already cancelled");

        isCancelled = true;
        emit CampaignCancelled();
    }

     /**
     * @dev Allows the platform admin to withdraw any remaining tokens after the campaign
     * is completed or cancelled. This is intended for scenarios like distributing surplus
     * funds or handling refunds off-chain.
     */
    function withdrawRemainingFunds() external nonReentrant onlyRole(PLATFORM_ADMIN_ROLE) {
        require(isCompleted || isCancelled, "AidBlocksEscrow: Campaign must be completed or cancelled to withdraw");

        uint256 remainingBalance = token.balanceOf(address(this));
        require(remainingBalance > 0, "AidBlocksEscrow: No remaining funds to withdraw");

        // Transfer remaining funds to the platform admin address (who called the function)
        // Ensure the admin has a clear policy on how these funds are handled (refunds, etc.)
        token.safeTransfer(msg.sender, remainingBalance);

        emit FundsWithdrawn(msg.sender, remainingBalance);
    }


    // --- View Functions ---

    /**
     * @dev Returns the details of a specific milestone.
     * @param _index The index of the milestone.
     * @return amountRequired The amount needed for the milestone.
     * @return isFunded Whether the funds for this milestone have been released.
     * @return isApproved Whether the evidence for this milestone has been approved.
     */
    function getMilestone(uint256 _index) external view returns (uint256 amountRequired, bool isFunded, bool isApproved) {
        require(_index < milestones.length, "AidBlocksEscrow: Invalid milestone index");
        Milestone storage m = milestones[_index];
        return (m.amountRequired, m.isFunded, m.isApproved);
    }

    /**
    * @dev Returns the total number of milestones defined for this campaign.
    */
    function getMilestoneCount() external view returns (uint256) {
        return milestones.length;
    }

    /**
     * @dev Returns the current balance of donation tokens held by this contract.
     */
    function getEscrowBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    // --- Receive Ether ---
    // Optional: Reject any accidental Ether transfers if not needed
    receive() external payable {
        revert("AidBlocksEscrow: Ether payments not accepted");
    }
    fallback() external payable {
         revert("AidBlocksEscrow: Fallback triggered, Ether payments not accepted");
    }
}