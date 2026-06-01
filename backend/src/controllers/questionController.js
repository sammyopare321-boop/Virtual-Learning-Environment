const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');

// Helper: verify teacher owns the quiz's course
async function verifyQuizOwnership(quizId, userId, userRole) {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) return { error: 'Quiz not found', status: 404 };
  const course = await Course.findById(quiz.course);
  if (course && course.teacher.toString() !== userId && userRole !== 'admin') {
    return { error: 'Not authorized', status: 403 };
  }
  return { quiz };
}

// @desc    Add question to quiz
// @route   POST /api/quizzes/:id/questions
// @access  Private (Teacher)
exports.addQuestion = async (req, res, next) => {
  const { error, status } = await verifyQuizOwnership(req.params.id, req.user.id, req.user.role);
  if (error) return res.status(status).json({ success: false, message: error });

  req.body.quiz = req.params.id;
  const question = await Question.create(req.body);
  res.status(201).json({ success: true, data: question });
};

// @desc    Get questions for a quiz (without correct answers)
// @route   GET /api/quizzes/:id/questions
// @access  Private
exports.getQuestions = async (req, res, next) => {
  const questions = await Question.find({ quiz: req.params.id }).sort('order');
  res.status(200).json({ success: true, count: questions.length, data: questions });
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private (Teacher)
exports.updateQuestion = async (req, res, next) => {
  const question = await Question.findById(req.params.id);
  if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

  const { error, status } = await verifyQuizOwnership(question.quiz, req.user.id, req.user.role);
  if (error) return res.status(status).json({ success: false, message: error });

  const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: updated });
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private (Teacher)
exports.deleteQuestion = async (req, res, next) => {
  const question = await Question.findById(req.params.id);
  if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

  const { error, status } = await verifyQuizOwnership(question.quiz, req.user.id, req.user.role);
  if (error) return res.status(status).json({ success: false, message: error });

  await question.deleteOne();
  res.status(200).json({ success: true, data: {} });
};
