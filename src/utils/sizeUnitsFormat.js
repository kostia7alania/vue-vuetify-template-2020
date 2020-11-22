/* eslint-disable no-param-reassign */

export default function sizeUnitsFormat(bytes) {
  if (bytes >= 1073741824) {
    bytes = `${(bytes / 1073741824).toFixed(2)} GB`
  } else if (bytes >= 1048576) {
    bytes = `${(bytes / 1048576).toFixed(2)} MB`
  } else if (bytes >= 1024) {
    bytes = `${(bytes / 1024).toFixed(2)} KB`
  } else if (bytes > 1) {
    bytes += ' bytes'
  } else if (bytes === 1) {
    bytes += ' byte'
  } else {
    bytes = '0 byte'
  }
  return bytes
}
