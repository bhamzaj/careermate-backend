module.exports = {
  respond: (res, data, confirmed = true) => {
    if (!confirmed) {
      return res.status(400).json({ confirmed: false, results: data })
    }
    return res.json({ confirmed: true, results: data })
  },
}
