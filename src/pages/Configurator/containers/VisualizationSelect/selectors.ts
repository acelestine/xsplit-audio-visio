export default {
  getVisualizer() {
    return (state: any) =>
      state.visualizations.list.find(
        (item: any) => item.value === state.visualizations.selected
      );
  },
};
