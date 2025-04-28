# Web3 Professional Identity Platform - Execution Plan

This document outlines the detailed steps required to build the MVP of the Web3 Professional Identity Platform.

## Phase 0: Data Modeling & Backend Setup (Convex)

- **Objective:** Define and implement the necessary off-chain data structures in Convex to support user profiles and networking features.
- **Steps:**
  - `[x]` **Define `users` Table/Entity:**
    - `[x]` Purpose: Store mutable profile information linked to a unique wallet address.
    - `[x]` Attributes:
      - `[x]` `address` (Identifier/String, Indexed): The user's Base wallet address. This uniquely identifies the user record. The wallet address must be stored in lowercase.
      - `[x]` `displayName` (Optional String): User-defined display name (distinct from Basename).
      - `[x]` `bio` (Optional String): A short text biography provided by the user.
      - `[x]` `manualStudies` (Optional Array of Strings): User-entered text describing educational background (e.g., "B.S. Computer Science @ State University, 2020").
      - `[x]` `manualExperience` (Optional Array of Strings): User-entered text describing work experience (e.g., "Software Engineer @ TechCorp, 2021-Present").
      - `[x]` `portfolioLinks` (Optional Array of Strings): URLs provided by the user linking to external portfolios, credential verification sites, or specific NFTs.
    - `[x]` Indexing: Ensure `address` is efficiently queryable.
  - `[x]` **Define `connections` Table/Entity:**
    - `[x]` Purpose: Track connection requests and established relationships between users.
    - `[x]` Attributes:
      - `[x]` `requesterAddress` (String, Indexed): The address of the user initiating the connection.
      - `[x]` `recipientAddress` (String, Indexed): The address of the user receiving the connection request.
      - `[x]` `status` (String, Indexed): The current state of the connection ('pending', 'connected', 'rejected').
    - `[x]` Indexing: Ensure `requesterAddress`, `recipientAddress`, and `status` are efficiently queryable, potentially using compound indexes for network views.
  - `[x]` **Implement Convex Schema:** Translate the defined entities and attributes into Convex's schema definition.
  - `[x]` **Implement Basic Convex Functions (Queries/Mutations):**
    - `[x]` `getUserProfile(address)`: Query to retrieve a user's profile data based on their address.
    - `[x]` `updateUserProfile(updates)`: Mutation to create or update a user's profile fields (bio, displayName, etc.).
    - `[x]` Initial setup complete function placeholders for connection logic (to be detailed in Phase 6).

## Phase 1: Profile Page - Viewing Basic Identity

- **Objective:** Create a page to display a user's basic on-chain and off-chain profile information.
- **Steps:**
  - `[ ]` **Create Profile Page Structure:**
    - `[ ]` Implement a dynamic route (e.g., `/profile/[address].tsx`) to display profiles based on wallet address.
    - `[ ]` Create the main Profile page component structure (e.g., Header, Bio section, Credentials section, etc.).
  - `[ ]` **Display Core On-Chain Identity:**
    - `[ ]` Fetch the profile address from the route parameters.
    - `[ ]` Use OnchainKit's `<Identity>` component as a context wrapper, passing the profile address and `chain: base`.
    - `[ ]` Inside `<Identity>` (or individually), render:
      - `[ ]` `<Avatar />`: To display the profile picture associated with the Basename/ENS.
      - `[ ]` `<Name />`: To display the resolved Basename (or fallback).
      - `[ ]` `<Address />`: To display the wallet address (potentially sliced).
  - `[ ]` **Implement Basename Check & Prompt:**
    - `[ ]` Utilize the `useName` hook from OnchainKit (or data from the `<Name>` component) to check if a Basename exists for the address.
    - `[ ]` Conditionally render a prominent message and a direct link to `https://base.org/names` if no Basename is resolved for the viewed profile's address.
  - `[ ]` **Display Off-Chain Profile Data:**
    - `[ ]` Call the `getUserProfile` Convex query from the frontend, passing the profile address.
    - `[ ]` Render the fetched `displayName` (if provided) near the `<Name>` component.
    - `[ ]` Render the fetched `bio` in a dedicated section.
    - `[ ]` Render `manualStudies`, `manualExperience`, and `portfolioLinks` (if they exist) in respective sections.
  - `[ ]` **Display Social Links:**
    - `[ ]` Integrate the OnchainKit `<Socials />` component into the profile header section, passing the profile address and `chain: base`.

## Phase 2: Profile Page - Editing Off-Chain Data

- **Objective:** Allow authenticated users to edit their own mutable profile information stored in Convex.
- **Steps:**
  - `[ ]` **Create Profile Editing UI:**
    - `[ ]` Design and implement an "Edit Profile" button visible only to the profile owner (compare connected wallet address with profile address).
    - `[ ]` Create a modal or separate page containing a form for editing: `displayName`, `bio`, `manualStudies`, `manualExperience`, `portfolioLinks`.
    - `[ ]` Ensure `manualStudies`, `manualExperience`, and `portfolioLinks` allow adding/removing multiple entries (e.g., lists with add/delete buttons).
  - `[ ]` **Implement Data Population:**
    - `[ ]` When the edit UI loads, fetch the current user's profile data using the `getUserProfile` Convex query and populate the form fields.
  - `[ ]` **Implement Data Persistence:**
    - `[ ]` On form submission:
      - `[ ]` Gather the updated data from the form fields.
      - `[ ]` Call the `updateUserProfile` Convex mutation, passing the updated data.
      - `[ ]` Handle potential errors from the mutation.
      - `[ ]` Provide visual feedback to the user (e.g., "Profile updated successfully", "Error updating profile").
      - `[ ]` Close the edit UI and ensure the Profile Page reflects the changes (Convex reactivity should handle this, but verify).

## Phase 3: Profile Page - Displaying Verifiable Credentials (SBTs/Attestations)

- **Objective:** Enhance the profile by displaying verifiable credentials, focusing on EAS Attestations (SBTs) via OnchainKit.
- **Steps:**
  - `[ ]` **Define Target Attestation Schemas:**
    - `[ ]` Research and list a few relevant EAS Schema UIDs (on Base) that represent educational achievements, skill certifications, or contributions (e.g., Coinbase Verified Account schema, potentially schemas from platforms like Gitcoin Passport, Rabbithole, etc.).
  - `[ ]` **Implement Attestation Fetching Logic:**
    - `[ ]` Create a Convex query function `getProfileAttestations(address)`:
      - `[ ]` This function should internally use OnchainKit's `getAttestations` utility.
      - `[ ]` Pass the profile `address`, the `base` chain object, and options to filter by the `schemas` defined above and `revoked: false`.
      - `[ ]` Return the list of relevant, non-revoked attestations.
  - `[ ]` **Display Attestations in UI:**
    - `[ ]` In the Profile Page component, call the `getProfileAttestations` query.
    - `[ ]` Create a dedicated "Verified Credentials" section.
    - `[ ]` Iterate through the fetched attestations:
      - `[ ]` For each attestation, display its significance (e.g., based on the schema name or decoded data).
      - `[ ]` Visually represent the verification using OnchainKit's `<Badge />` component.
      - `[ ]` Configure the `<Badge />` with `tooltip={true}` or a custom tooltip string to show details about the attestation on hover (requires `<Identity>` provider context with the correct `schemaId` or careful manual handling). _Initially, might just display badge presence for simplicity._
  - `[ ]` **Display Manually Linked Credentials:**
    - `[ ]` Ensure the `portfolioLinks` (added in Phase 2/3) are displayed clearly, perhaps in a separate "Links" or "Portfolio" section, distinct from _verified_ on-chain credentials.

## Phase 4: Basic User Discovery (Search)

- **Objective:** Allow users to find other registered users by searching their Basename or wallet address.
- **Steps:**
  - `[ ]` **Implement Search Input UI:**
    - `[ ]` Add a search bar component (e.g., in the application header or a dedicated search page).
    - `[ ]` Include an input field and a search button.
  - `[ ]` **Implement Backend Search Logic (Convex):**
    - `[ ]` Create a Convex query function `searchUser(searchText)`:
      - `[ ]` Determine if `searchText` is likely an address or a name (e.g., check for `0x` prefix or `.base.eth` suffix).
      - `[ ]` If it's a name, attempt to resolve it to an address using OnchainKit's `getAddress({ name: searchText, chain: base })` server-side. Handle cases where the name doesn't resolve.
      - `[ ]` Query the `users` table in Convex by the determined address(es).
      - `[ ]` Return a list of matching user summaries (e.g., `address`, `displayName`, resolved `Basename`).
  - `[ ]` **Display Search Results:**
    - `[ ]` Create a component to display the search results returned by the Convex query.
    - `[ ]` For each result, show basic info (e.g., Avatar snippet using `<Avatar/>`, Basename using `<Name/>`, Address using `<Address/>`).
    - `[ ]` Make each result item clickable, linking to the corresponding `/profile/[address]` page.

## Phase 5: Basic Networking (Off-Chain Connections via Convex)

- **Objective:** Implement a simple system for users to request and manage connections with others, stored off-chain.
- **Steps:**
  - `[ ]` **Implement Connection Actions on Profiles:**
    - `[ ]` On another user's profile page, display a "Connect" button (only if not already connected or request pending).
    - `[ ]` Button click should trigger a Convex mutation `sendConnectionRequest(recipientAddress)`.
      - `[ ]` Mutation logic: Check if a request already exists; if not, create a `connections` record with status 'pending', `requesterAddress` = current user, `recipientAddress` = profile owner.
    - `[ ]` Update the button state upon successful request (e.g., disable and show "Request Sent").
  - `[ ]` **Create "My Network" Page/UI:**
    - `[ ]` Design a page or section accessible to the logged-in user.
    - `[ ]` Structure it with tabs or sections for: "Incoming Requests", "Outgoing Requests", "Connections".
  - `[ ]` **Implement Backend Logic for Network Views (Convex Queries):**
    - `[ ]` `getPendingIncomingRequests()`: Query `connections` where `recipientAddress` is current user and `status` is 'pending'. Return relevant data including requester's info (join/lookup `users` table).
    - `[ ]` `getPendingOutgoingRequests()`: Query `connections` where `requesterAddress` is current user and `status` is 'pending'. Return relevant data including recipient's info.
    - `[ ]` `getConnections()`: Query `connections` where status is 'connected' and either `requesterAddress` or `recipientAddress` is the current user. Return relevant data about the connected users.
  - `[ ]` **Display Network Information:**
    - `[ ]` Call the Convex queries from the "My Network" page.
    - `[ ]` Render the lists of users for each section (Incoming, Outgoing, Connected), showing basic profile info (Avatar, Name).
  - `[ ]` **Implement Request Handling Actions:**
    - `[ ]` In the "Incoming Requests" section, display "Accept" and "Reject" buttons next to each request.
    - `[ ]` Create a Convex mutation `respondToConnectionRequest(requesterAddress, accept: boolean)`:
      - `[ ]` Mutation logic: Find the pending connection record. Update its `status` to 'connected' if `accept` is true, or 'rejected' if false.
      - `[ ]` Ensure only the recipient can call this for a specific request.
    - `[ ]` Connect the Accept/Reject buttons to this mutation.
    - `[ ]` Update the UI dynamically upon response (request moves to "Connections" or disappears).

## Phase 7: Final Polish & Deployment Prep

- **Objective:** Clean up the UI, fix minor bugs, ensure basic responsiveness, and prepare for deployment.
- **Steps:**
  - `[ ]` **UI/UX Review:**
    - `[ ]` Perform a visual check for consistent styling (fonts, colors, spacing, button styles) across all pages and interactive components (Profile View, Profile Edit, Search Results, Network Page).
    - `[ ]` Verify that loading indicators are present during data fetching operations (e.g., fetching profile data, attestations, search results, network lists). Ensure they are replaced correctly once data loads or an error occurs.
    - `[ ]` Review error messages presented to the user. Ensure they are user-friendly and clearly indicate the problem (e.g., "Could not load profile", "Connection request failed", "Search failed"). Avoid overly technical jargon.
    - `[ ]` Test the application flow on different screen sizes (desktop, tablet, mobile). Identify and fix major layout issues, ensuring core functionality remains accessible and usable on smaller screens. Prioritize readability and button accessibility.
  - `[ ]` **Code Cleanup:**
    - `[ ]` Systematically search for and remove any temporary `console.log`, `console.error`, or similar debugging statements from both frontend (React) and backend (Convex) code.
    - `[ ]` Identify and delete any commented-out code blocks that are no longer relevant or intended for future use.
    - `[ ]` Review component prop types and function signatures for clarity and consistency. Add comments to explain complex logic sections or non-obvious functionalities, particularly in Convex functions and data transformation steps.
    - `[ ]` Confirm that all necessary API keys (CDP Client Key, CDP Project ID) and potentially other configurations (Convex deployment URL) are sourced from environment variables (`.env.local`, Vercel environment variables) and _not_ hardcoded.
  - `[ ]` **Final Manual Testing:**
    - `[ ]` Execute a comprehensive walkthrough of all user scenarios defined in previous phases (connect, view profile, edit, search, send request, accept request, reject request) using the intended deployment target network (e.g., Base Sepolia or Base Mainnet).
    - `[ ]` Test edge cases again: profile without Basename, profile with many attestations, profile with no off-chain data, searching non-existent users, handling failed connection requests.
    - `[ ]` Verify external links (Basename creation link, social links, portfolio links) open correctly.
  - `[ ]` **Prepare Deployment Configuration:**
    - `[ ]` Configure the Vercel project settings, linking it to the correct Git repository branch.
    - `[ ]` Ensure the build command and output directory settings in Vercel are correct for the Next.js project.
    - `[ ]` Confirm that the Convex project is linked to the Vercel deployment environment (using Vercel's Convex integration or environment variables).
    - `[ ]` Define all required environment variables (CDP keys, Convex URL) within the Vercel project settings for the production environment.
  - `[ ]` **Staging Deployment and Test:**
    - `[ ]` Trigger a deployment to a Vercel preview/staging environment.
    - `[ ]` Perform a quick smoke test on the deployed staging instance to ensure basic functionality is working as expected outside the local development environment. Check console for errors.
