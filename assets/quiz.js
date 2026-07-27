/* ==========================================================================
   Reusable quiz widget. Zero dependencies. Reused across every lesson.

   Markup contract:
   <div class="quiz" data-answer="1">
     <p class="q">Question text…</p>
     <button class="quiz-opt">Option A</button>
     <button class="quiz-opt">Option B</button>   <!-- index 1 = correct -->
     <button class="quiz-opt">Option C</button>
     <div class="quiz-feedback" data-correct="Nice — because…"
                                data-wrong="Not quite — remember…"></div>
   </div>

   data-answer is the 0-based index of the correct button.
   Feedback is immediate and automatic: the whole point is a tight loop.
   ========================================================================== */
(function () {
  function initQuiz(quiz) {
    var answer = parseInt(quiz.getAttribute('data-answer'), 10);
    var opts = Array.prototype.slice.call(quiz.querySelectorAll('.quiz-opt'));
    var feedback = quiz.querySelector('.quiz-feedback');

    opts.forEach(function (opt, i) {
      opt.addEventListener('click', function () {
        var right = i === answer;
        // Lock the quiz and reveal the correct answer.
        opts.forEach(function (o, j) {
          o.disabled = true;
          if (j === answer) o.classList.add('correct');
        });
        if (!right) opt.classList.add('wrong');

        if (feedback) {
          feedback.textContent = right
            ? (feedback.getAttribute('data-correct') || 'Correct.')
            : (feedback.getAttribute('data-wrong') || 'Not quite — the highlighted answer is correct.');
          feedback.classList.remove('correct', 'wrong');
          feedback.classList.add('show', right ? 'correct' : 'wrong');
        }
      });
    });
  }

  function boot() {
    document.querySelectorAll('.quiz').forEach(initQuiz);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
