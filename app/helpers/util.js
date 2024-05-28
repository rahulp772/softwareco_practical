function chunkArray(array, size) {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
      array.slice(index * size, (index + 1) * size)
    );
}

module.exports = {
    chunkArray
}