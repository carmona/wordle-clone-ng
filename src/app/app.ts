import { Component, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { WordMatrix } from "./word-matrix/word-matrix";
import { Row, Cell } from './types';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('wordle-clone-ng');
  inputValue: string = '';
  formDisabled: boolean = false;
  currentRow: number = 0;
  gameStatus: 'playing' | 'won' | 'lost' = 'playing';
  chosenWord: string = 'world';
  rows: Row[] = Array.from({ length: 6 }, () => ({ cells: Array(5).fill({ letter: null, status: undefined }), isFilled: false }));

  onSendInput(event: Event) {
    event.preventDefault();
    console.info('onSendInput', this.inputValue, event);
    // this.formDisabled = true;
    this.updateMatrix(this.inputValue);
    // this.formDisabled = false;
    this.inputValue = '';
    // const input = event.target as HTMLInputElement;
    // input.value = '';
  }

  checkGameStatus() {
    // logic to check if the game is won or lost
    this.rows.forEach(row => {
      if (row.isFilled) {
        const guessedWord = this.cellsToWord(row.cells);
        if (guessedWord === this.chosenWord) {
          this.gameStatus = 'won';
          console.info('Game won!');
        }
      }
    });
    if (this.rows.every(row => row.isFilled) && this.gameStatus !== 'won') {
      this.gameStatus = 'lost';
      console.info('Game lost!');
    }
    if (this.gameStatus !== 'playing') {
      this.formDisabled = true;
    }
    // set focus back to input
    const inputElement = document.getElementById('word-input');
    if (inputElement) {
      inputElement.focus();
    }
  }

  updateMatrix(newWord: string) {
    const cells = this.wordToCells(newWord);
    const rowIndex = this.currentRow;
    if (rowIndex >= this.rows.length) {
      console.warn('No more rows available. Game over.');
      this.gameStatus = 'lost';
      this.formDisabled = true;
      return;
    } else {
      this.rows[rowIndex].cells = cells;
      this.rows[rowIndex].isFilled = true;
      this.currentRow += 1;
    }
    // logic to add new word to the matrix
    this.checkGameStatus();
  }

  wordToCells(word: string): Cell[] {
    return word.split('').map((letter, index) => {
      let status: 'correct' | 'present' | 'absent' = 'absent';
      if (letter === this.chosenWord[index]) {
        status = 'correct';
      } else if (this.chosenWord.includes(letter)) {
        status = 'present';
      }
      return { letter, status };
    });
  }

  cellsToWord(cells: Cell[]): string {
    return cells.map(cell => cell.letter).join('');
  }

  resetGame() {
    this.rows = Array.from({ length: 6 }, () => ({ cells: Array(5).fill({ letter: null, status: undefined }), isFilled: false }));
    this.currentRow = 0;
    this.gameStatus = 'playing';
    this.formDisabled = false;
  }
}