const spawn = require('cross-spawn')
const exec = require('execa')
const Promise = require('promise')

const output = require('./output')

module.exports = function downloadExample(opts) {
  const projectName = opts.projectName
  const example = opts.example
  const cmds = [
    `mkdir -p ${projectName}`,
    `curl https://codeload.github.com/dotmind/boilerplates-templates/tar.gz/main | tar -xz -C ${projectName} --strip=3 boilerplates-templates-main/examples/${example}`
  ]

  const stopExampleSpinner = output.wait(`Downloading files for ${output.cmd(example)} example`)
  const cmdPromises = cmds.map(function (cmd) {
    return exec.shell(cmd)
  })

  return Promise.all(cmdPromises).then(function () {
    stopExampleSpinner()
    output.success(`Downloaded ${output.cmd(example)} files for ${output.cmd(projectName)}`)
  }).catch(function (err) {
    output.error(err.message);
    stopExampleSpinner()
    output.error(`Error downloading ${output.cmd(example)} files for ${output.cmd(projectName)}`)
    throw err
  })
}
