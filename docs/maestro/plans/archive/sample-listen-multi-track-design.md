# Multi-Track Sample Listen Button Implementation Plan

## Objective
Update the existing 'Sample Listen' modal to support multiple audio tracks from Google Drive. Display a list of buttons for the tracks above the audio player.

## Implementation Steps

1.  **Update `index.html`**
    *   In the `#sample-modal`, replace the placeholder `<p>` tag with a new container for the track buttons (e.g., `<div id="track-list" class="track-list"></div>`).
    *   Add a title element above the player to show the currently playing track.

2.  **Update `style.css`**
    *   Add styling for `.track-list` (e.g., flexbox/grid layout, gap, padding).
    *   Add styling for the individual track buttons (`.track-btn`), including default, hover, and active states to show which track is currently selected.
    *   Style the current track title display.

3.  **Update `script.js`**
    *   Define the array of tracks containing the ID/Key, Korean title, English title, and the converted Google Drive direct download URL.
        *   Google Drive URLs will be formatted as `https://drive.google.com/uc?export=download&id=[FILE_ID]`
    *   Add English and Korean translation keys for the 7 track titles to the `translations` object.
    *   Add logic to dynamically generate the track buttons inside `#track-list` based on the tracks array and the current language.
    *   Add click event listeners to the generated buttons.
    *   Update the modal open logic to initialize the first track if none is selected.
    *   Update the language switcher logic (`setLanguage` function) to update the track button texts when the language changes.
