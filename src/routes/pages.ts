router.get('/quizzes/:id', async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).send('Introuvable');
  res.render('quiz', { quiz });
});