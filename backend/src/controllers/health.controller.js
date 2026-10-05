const getHealth = (req, res) => {
  res.json({
    status: 'ok',
    message: 'Hotel API is running',
  })
}

export default getHealth