export const viteProPlugin = () => {
  return {
    name: "build-plugin",
    closeBundle() {
      const build = new BuildObject();
    }
  };
}