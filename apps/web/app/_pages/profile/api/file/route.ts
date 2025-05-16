"use server";

import { pinata } from "@/app/_shared/lib/pinata.config";

export async function uploadCertificateJSON(
  name: string,
  issuingCompany: string,
  issueDate: string,
  credentialId: string,
  credentialUrl: string,
  imageUrl: string,
) {
  try {
    const upload = await pinata.upload.public
      .json({
        name,
        description: "Skill Based Certificate",
        attributes: [
          {
            trait_type: "Issuing Company",
            value: issuingCompany,
          },
          {
            trait_type: "Issue Date",
            value: issueDate,
          },
          {
            trait_type: "Credential ID",
            value: credentialId,
          },
          {
            trait_type: "Credential URL",
            value: credentialUrl,
          },
        ],
        image: imageUrl,
      })
      .name(name);

    return upload;
  } catch (e) {
    console.log(e);
  }
}
