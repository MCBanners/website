export default {
  setFonts(state, fonts) {
    state.fonts = fonts
  },

  setTemplates(state, templates) {
    state.templates = templates
  },

  setTextAlignments(state, textAlignments) {
    state.text_alignments = textAlignments
  },

  setDefaults(state, payload) {
    state.defaults = payload
  },
}
