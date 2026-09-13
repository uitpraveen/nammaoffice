# Managing client logos in NammaOffice Studio

These instructions apply to the new local Studio at **http://127.0.0.1:3001/admin/login**. It has not been deployed. Use your individual staff email/password. See [local access and VPS operations](./vps-cms.md).

## Add a logo

1. Open **Client logos** and choose **Add client logo**.
2. Enter the client name, image description, optional website and display order.
3. Choose an image from the media library or upload original artwork: still PNG/JPG/WebP/plain SVG, up to 10 MB and 24 megapixels.
4. If needed, enable cropping and drag the selection/corner handles, choose a shape preset, or enter precise percentages. Adjust padding or optional border trimming. Colours and internal backgrounds are preserved. Press **Prepare image**, wait for processing, and inspect the result before choosing **Use this image**.
5. Save and preview the draft. Press **Publish** when it looks correct, then refresh the homepage to check.

Tamil names are supported. Lower display-order values appear first. The website fits artwork into consistent slots without stretching. Use adequate source resolution; small artwork is not artificially enlarged during processing.

## Replace or remove

Open an existing client and use **Adjust crop** to edit its preserved original, or choose replacement artwork and save. The old published logo remains visible while the replacement is a draft. Publishing makes the replacement public. Revisions keep previous artwork available for recovery.

**Archive** removes the client from the homepage while keeping it in Studio. **Trash** removes it from the normal content list and the homepage; restore it from the trash list as a draft, then publish if required. Neither action permanently destroys artwork. The media library refuses to trash files needed by content or its revision history.

## When an action fails

- **A newer version exists:** reload and review the other editor's changes before saving. Do not keep retrying an outdated draft.
- **Image processing is pending:** check the worker indicator on the dashboard. You can close the dialog and return to the library; queued files survive a worker restart.
- **Processing failed:** use Retry in the library, or export a valid image again. Complex SVG styles/external references are intentionally rejected; a plain SVG or PNG works.
- **Connection lost:** reload before retrying. The first save/upload may already have completed; repeated identical uploads with the same options reuse the stored image.
- **Access denied:** authors cannot manage client logos; use an editor or administrator account.

Original downloads require staff authorization. Prepared images are private until published. After removal, a visitor's existing image cache can take up to 60 seconds to expire.

See [cropping and hero posters](./hero-posters-and-cropping.md) for the new visual controls and event-promotion workflow.
