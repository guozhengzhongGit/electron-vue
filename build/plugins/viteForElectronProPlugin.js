import BuildObject from './productionBuildObject';
export const viteProPlugin = () => {
  return {
    name: "build-plugin",
    closeBundle() {
      const build = new BuildObject();
      build.buildMain();
      build.preparePackageJson();
      build.buildInstaller();
    }
  };
}