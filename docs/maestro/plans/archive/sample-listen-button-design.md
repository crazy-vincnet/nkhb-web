# Sample Listen Button Implementation Plan

## Objective
Add a 'Sample Listen' (샘플듣기) button to the Program Structure (Composition) section that opens a modal with a placeholder audio player.

## Implementation Steps

1.  **Update `index.html`**
    *   Add a "Sample Listen" button below the description in the `composition` section header.
    *   Add a new modal markup (`#sample-modal`) at the bottom of the page, containing an `<audio controls>` element.

2.  **Update `style.css`**
    *   Add styles for the new button placement (e.g., center alignment, margin).
    *   Add styles for the audio player modal layout to ensure it looks clean and consistent with other modals.

3.  **Update `script.js`**
    *   Add translation keys for the new button and modal title in both English and Korean objects (`composition_button_sample`, `sample_modal_title`).
    *   Add event listeners to handle opening, closing, and backdrop-clicking for the `#sample-modal`.
    *   Add logic to pause the `<audio>` element when the modal is closed so it doesn't keep playing in the background.

## Verification
*   Check that the button is visible and properly localized in both EN and KO.
*   Click the button to ensure the modal opens correctly.
*   Verify the audio player is present and centered in the modal.
*   Close the modal and ensure it disappears smoothly and the audio stops playing.
