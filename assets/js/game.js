document.addEventListener('DOMContentLoaded', function() {
    const WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    let board, current, over, scores = {X:0, O:0};
  
    function init(){
      board = Array(9).fill(null);
      current = 'X';
      over = false;
      document.querySelectorAll('.ttt-cell').forEach(c => {
        c.removeAttribute('data-mark');
        c.classList.remove('win-cell');
        c.textContent = '';
        c.disabled = false;
      });
      setStatus('Your turn — X');
      updatePills();
    }
  
    function setStatus(msg, type){
      const el = document.getElementById('ttt-status');
      if(el) {
        el.textContent = msg;
        el.className = 'ttt-status' + (type ? ' ' + type : '');
      }
    }
  
    function updatePills(){
      const scoreX = document.getElementById('score-x');
      const scoreO = document.getElementById('score-o');
      const pillX = document.getElementById('ttt-score-x');
      const pillO = document.getElementById('ttt-score-o');
      
      if (scoreX && scoreO && pillX && pillO) {
        scoreX.textContent = scores.X;
        scoreO.textContent = scores.O;
        pillX.classList.toggle('active', current === 'X' && !over);
        pillO.classList.toggle('active', current === 'O' && !over);
      }
    }
  
    function checkWin(){
      for(const[a,b,c] of WINS) {
        if(board[a] && board[a] === board[b] && board[a] === board[c]) return [a,b,c];
      }
      return null;
    }
  
    // --- MINIMAX AI LOGIC ---
    function evaluate(b) {
      for(const[x,y,z] of WINS) {
        if(b[x] && b[x] === b[y] && b[x] === b[z]) return b[x] === 'O' ? 10 : -10;
      }
      return 0;
    }
  
    function minimax(b, depth, isMax) {
      let score = evaluate(b);
      
      if (score === 10) return score - depth; 
      if (score === -10) return score + depth; 
      if (!b.includes(null)) return 0;
  
      if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (!b[i]) {
            b[i] = 'O';
            best = Math.max(best, minimax(b, depth + 1, !isMax));
            b[i] = null; 
          }
        }
        return best;
      } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
          if (!b[i]) {
            b[i] = 'X';
            best = Math.min(best, minimax(b, depth + 1, !isMax));
            b[i] = null; 
          }
        }
        return best;
      }
    }
  
    function makeAIMove() {
      if (over) return;
      
      // DIFFICULTY FOR THE AI TO BE
      const AI_DIFFICULTY = 0.9; 
  
      if (Math.random() > AI_DIFFICULTY) {
        let available = [];
        for (let i = 0; i < 9; i++) if (!board[i]) available.push(i);
        
        let randomMove = available[Math.floor(Math.random() * available.length)];
        const cell = document.querySelector(`.ttt-cell[data-i="${randomMove}"]`);
        executeMove(cell, randomMove);
        return;
      }
  
      let bestVal = -Infinity;
      let bestMove = -1;
  
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'O';
          let moveVal = minimax(board, 0, false);
          board[i] = null; 
          if (moveVal > bestVal) {
            bestMove = i;
            bestVal = moveVal;
          }
        }
      }
  
      if (bestMove !== -1) {
        const cell = document.querySelector(`.ttt-cell[data-i="${bestMove}"]`);
        executeMove(cell, bestMove);
      }
    }
  
    // --- GAME EXECUTION ---
    function executeMove(cell, i) {
      board[i] = current;
      cell.setAttribute('data-mark', current);
      cell.textContent = current;
      cell.disabled = true;
      
      const win = checkWin();
      if(win){
        over = true;
        scores[current]++;
        win.forEach(idx => document.querySelector(`.ttt-cell[data-i="${idx}"]`).classList.add('win-cell'));
        setStatus(current === 'X' ? 'You win! :D' : 'AI wins! :(', 'win');
        updatePills();
        return;
      }
      
      if(board.every(Boolean)){
        over = true;
        setStatus('Draw — well played.', 'draw');
        updatePills();
        return;
      }
      
      current = current === 'X' ? 'O' : 'X';
      setStatus(current === 'X' ? 'Your turn — X' : 'AI is thinking...');
      updatePills();
  
      if (current === 'O' && !over) {
        setTimeout(makeAIMove, 450); 
      }
    }
  
    function handleClick(e){
      if (over) {
        init();
        return; 
      }
  
      if (current !== 'X') return; 
      
      const cell = e.currentTarget, i = parseInt(cell.dataset.i, 10);
      
      if (board[i]) return;
      
      executeMove(cell, i);
    }
  
    document.querySelectorAll('.ttt-cell').forEach(c => c.addEventListener('click', handleClick));
    
    const resetBtn = document.getElementById('ttt-reset');
    if (resetBtn) resetBtn.addEventListener('click', init);
    
    // THE CRITICAL FIX: Initialize the board into memory on page load!
    init();
  
  });