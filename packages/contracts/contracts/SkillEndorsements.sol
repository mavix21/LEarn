// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SkillEndorsements
 * @author SkillBased Team
 * @notice A contract for users to endorse specific skills of other users on-chain.
 * Endorsement reasons are stored off-chain, and their hashes are recorded on-chain.
 */
contract SkillEndorsements is ReentrancyGuard {
  struct Endorsement {
    address endorser;
    address recipient;
    bytes32 skillId;
    bytes32 reasonHash;
    uint256 timestamp;
  }

  mapping (address => mapping(bytes32 => uint256)) public skillEndorsementCounts;

  mapping (address => mapping (bytes32 => mapping (address => bool))) public hasEndorsedSkill;

  event SkillEndorsed(
    address indexed endorser,
    address indexed recipient,
    bytes32 indexed skillId,
    bytes32 reasonHash,
    uint256 timestamp
  );

  event EndorsementRetracted(
    address indexed endorser,
    address indexed recipient,
    bytes32 indexed skillId,
    uint256 timestamp
  );

  /**
     * @notice Endorses a specific skill for a recipient.
     * @param _recipient The address of the user whose skill is being endorsed.
     * @param _skillId A unique identifier for the skill (e.g., keccak256 of the skill name).
     * @param _reasonHash A hash of the off-chain stored reason for the endorsement.
     *
     * Requirements:
     * - The `_recipient` cannot be the zero address.
     * - The `_recipient` cannot be the endorser themselves.
     * - The `msg.sender` (endorser) must not have already endorsed this specific skill for this `_recipient`.
     */
  function endorseSKill(
    address _recipient,
    bytes32 _skillId,
    bytes32 _reasonHash
  ) external nonReentrant {
    address _endorser = msg.sender;

    require(_recipient != address(0), "SkillEndorsements: Recipient cannot be the zero address");
    require(_recipient != _endorser, "SkillEndorsements: Cannot endorse yourself");
    require(
      !hasEndorsedSkill[_recipient][_skillId][_endorser],
      "SkillEndorsements: Skill already endorsed by you for this recipient"
    );

    skillEndorsementCounts[_recipient][_skillId]++;
    hasEndorsedSkill[_recipient][_skillId][_endorser] = true;

    emit SkillEndorsed(
      _endorser,
      _recipient,
      _skillId,
      _reasonHash,
      block.timestamp
    );
  }

  /**
     * @notice Allows an endorser to retract their endorsement for a specific skill of a recipient.
     * @param _recipient The address of the user whose skill endorsement is being retracted.
     * @param _skillId A unique identifier for the skill.
     *
     * Requirements:
     * - The `_recipient` cannot be the zero address.
     * - The `msg.sender` (endorser) must have previously endorsed this specific skill for this `_recipient`.
     */
    function retractEndorsement(
        address _recipient,
        bytes32 _skillId
    ) external nonReentrant {
      address _endorser = msg.sender;

      require(_recipient != address(0), "SkillEndorsements: Recipient cannot be the zero address");
      require(hasEndorsedSkill[_recipient][_skillId][_endorser], "SkillEndorsements: Skill not previously endorsed by you for this recipient");

      skillEndorsementCounts[_recipient][_skillId]--;
      hasEndorsedSkill[_recipient][_skillId][_endorser] = false;

      emit EndorsementRetracted(
          _endorser,
          _recipient,
          _skillId,
          block.timestamp
      );
  }

  /**
   * @notice Gets the number of endorsements a user has for a specific skill.
   * @param _user The address of the user.
   * @param _skillId The unique identifier for the skill.
   * @return The count of endorsements.
   */
  function getEndorsementCount(address _user, bytes32 _skillId) external view returns (uint256) {
    return skillEndorsementCounts[_user][_skillId];
  }

  /**
   * @notice Checks if a specific endorser has endorsed a particular skill for a user.
   * @param _user The address of the user whose skill is being checked.
   * @param _skillId The unique identifier for the skill.
   * @param _endorser The address of the potential endorser.
   * @return True if the endorser has endorsed the skill for the user, false otherwise.
   */
  function checkHasEndorsed(address _user, bytes32 _skillId, address _endorser) external view returns (bool) {
    return hasEndorsedSkill[_user][_skillId][_endorser];
  }
}