// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SkillBased is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIdCounter;

    // --- Events ---
    event CertificateMinted(
        uint256 indexed tokenId,
        address indexed minter,
        address indexed recipient, // In case minter can mint for someone else, or just for themselves
        string tokenURI
    );

    event CertificateEndorsed(
        uint256 indexed tokenId,
        address indexed endorser,
        string comment // Optional: a comment for the endorsement
    );

    // --- Endorsement Storage ---
    // Mapping from Token ID to a list of endorser addresses
    mapping(uint256 => address[]) private _endorsersByTokenId;

    // Mapping to quickly check if a user has already endorsed a specific token
    // tokenId => endorserAddress => bool
    mapping(uint256 => mapping(address => bool)) private _hasUserEndorsedTokenId;

    // Maximum length for an endorsement comment
    uint256 public constant MAX_ENDORSEMENT_COMMENT_LENGTH = 256;

    // --- Constructor ---
    constructor(address initialOwner) ERC721("SkillBased", "SKB") Ownable(initialOwner) {}

    // --- Minting Function (Public) ---
    /**
     * @notice Allows any user to mint a new certificate.
     * @param recipient The address that will receive the minted NFT.
     * @param tokenURI The URI pointing to the certificate's metadata.
     * @return newItemId The ID of the newly minted token.
     */
    function mintNFT(address recipient, string memory tokenURI)
        public
        nonReentrant // Protect against reentrancy attacks
        returns (uint256)
    {
        require(recipient != address(0), "SKB: Mint to the zero address");
        require(bytes(tokenURI).length > 0, "SKB: TokenURI cannot be empty");

        _tokenIdCounter++;
        uint256 newItemId = _tokenIdCounter;

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        emit CertificateMinted(newItemId, msg.sender, recipient, tokenURI);

        return newItemId;
    }

    // --- Endorsement Function ---
    /**
     * @notice Allows a user to endorse an existing certificate.
     * @dev Prevents self-endorsement and double endorsements.
     * @param tokenId The ID of the certificate to endorse.
     * @param comment A comment to accompany the endorsement (optional, can be empty).
     */
    function endorseCertificate(uint256 tokenId, string memory comment)
        public
        nonReentrant
    {
        require(ownerOf(tokenId) != msg.sender, "SKB: Cannot endorse your own certificate.");
        require(!_hasUserEndorsedTokenId[tokenId][msg.sender], "SKB: Already endorsed this certificate.");
        require(bytes(comment).length <= MAX_ENDORSEMENT_COMMENT_LENGTH, "SKB: Endorsement comment too long.");

        _endorsersByTokenId[tokenId].push(msg.sender);
        _hasUserEndorsedTokenId[tokenId][msg.sender] = true;

        emit CertificateEndorsed(tokenId, msg.sender, comment);
    }

    // --- Getter Functions for Endorsements ---

    /**
     * @notice Gets the list of addresses that have endorsed a specific certificate.
     * @param tokenId The ID of the certificate.
     * @return An array of endorser addresses.
     */
    function getEndorsers(uint256 tokenId) external view returns (address[] memory) {
        return _endorsersByTokenId[tokenId];
    }

    /**
     * @notice Gets the number of endorsements for a specific certificate.
     * @param tokenId The ID of the certificate.
     * @return The total count of endorsements.
     */
    function getEndorsementCount(uint256 tokenId) external view returns (uint256) {
        return _endorsersByTokenId[tokenId].length;
    }

    /**
     * @notice Checks if a specific user has endorsed a particular certificate.
     * @param tokenId The ID of the certificate.
     * @param endorser The address of the user to check.
     * @return True if the user has endorsed the certificate, false otherwise.
     */
    function hasEndorsed(uint256 tokenId, address endorser) external view returns (bool) {
        return _hasUserEndorsedTokenId[tokenId][endorser];
    }

    // --- Optional: Admin Functions (using Ownable) ---
    // Example: The owner might be able to set a new max comment length
    function setMaxEndorsementCommentLength(uint256 newMaxLength) public onlyOwner {
        // require(newMaxLength > 0 && newMaxLength < 1024, "SKB: Invalid length"); // Example validation
        // MAX_ENDORSEMENT_COMMENT_LENGTH = newMaxLength; // Note: constants cannot be changed.
        // If you need this to be variable, declare it as a state variable instead of a constant.
        // For this example, we'll assume it's fixed at compile time.
        // If dynamic, it would be:
        // uint256 public maxEndorsementCommentLength = 256;
        // function setMaxEndorsementCommentLength(uint256 newMaxLength) public onlyOwner {
        //     maxEndorsementCommentLength = newMaxLength;
        // }
        // And update the require in endorseCertificate to use this variable.
        // For now, keeping it as a constant simplifies things.
    }

    // The _beforeTokenTransfer and _afterTokenTransfer hooks from ERC721 are available
    // if you need to add logic when tokens are transferred (e.g., clearing endorsements
    // if a certificate is transferred - though typically endorsements would stay with the certificate content).

    // ERC721URIStorage already provides tokenURI(uint256 tokenId)

    // To support burning by the token owner, you could import ERC721Burnable.sol
    // and inherit from it: contract SkillBased is ERC721URIStorage, Ownable, ReentrancyGuard, ERC721Burnable {
    // This would give owners a burn(tokenId) function.
}