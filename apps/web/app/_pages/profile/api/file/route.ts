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
        issuingCompany,
        issueDate,
        credentialId,
        credentialUrl,
        imageUrl,
      })
      .name(name);

    return upload;
  } catch (e) {
    console.log(e);
  }
}
