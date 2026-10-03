# Google Cloud credentials

The servers use Google Application Default Credentials (ADC). Do not commit a
service-account key or copy one into a Docker image. The tracked
`google-credentials-production.json` files are temporary binary placeholders
for a safe removal in a follow-up change; they are not usable credentials.

For local development, use your own authorized identity:

```sh
gcloud auth application-default login
gcloud auth application-default set-quota-project decoded-app-457000-s2
```

If a service account is required locally, an authorized operator can set
`GOOGLE_APPLICATION_CREDENTIALS` to an absolute path outside this repository.
Keep that file out of Git, Docker build contexts, logs, and chat.

On Cloud Run, attach a service account with the permissions each service needs.
Confirm the attached identity and Secret Manager access for `vexus-atlas`,
`dhrem-research`, and `tpa-pocus-atlas` before deploying this change. The
current TPA deployment scripts do not specify a service account. Remove or
rotate every exposed key separately; removing files from Git does not revoke
the old keys or erase them from history and existing images.
