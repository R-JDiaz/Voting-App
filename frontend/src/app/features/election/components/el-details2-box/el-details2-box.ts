import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { environment } from '@env/environments';

@Component({
  selector: 'app-el-details2-box',
  imports: [CommonModule],
  templateUrl: './el-details2-box.html',
  styleUrl: './el-details2-box.scss',
})
export class ElDetails2Box {
  assetPath = environment.assetPath;
  addOpen = true;
  uploadedFileName: string = '';
   @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  positions = [
    
    { name: 'POSITION-NAME', open: true, candidates: ['CANDIDATE-NAME','CANDIDATE-NAME','CANDIDATE-NAME', 'CANDIDATE-NAME', 'CANDIDATE-NAME'] },
    { name: 'POSITION-NAME', open: true, candidates: ['CANDIDATE-NAME','CANDIDATE-NAME','CANDIDATE-NAME', 'CANDIDATE-NAME', 'CANDIDATE-NAME'] },
    { name: 'POSITION-NAME', open: true, candidates: ['CANDIDATE-NAME','CANDIDATE-NAME','CANDIDATE-NAME', 'CANDIDATE-NAME', 'CANDIDATE-NAME'] },
    { name: 'POSITION-NAME', open: true, candidates: ['CANDIDATE-NAME','CANDIDATE-NAME','CANDIDATE-NAME'] }
  ];

  toggleAdd() {
    this.addOpen = !this.addOpen;
  }

  togglePosition(index: number) {
    this.positions[index].open = !this.positions[index].open;
  }

  updateCharCount(event: any) {
    const textarea = event.target;
    const charCount = textarea.value.length;
    // Update the character count display
    const charSpan = textarea.closest('.field-group')?.querySelector('.char-count');
    if (charSpan) {
      charSpan.textContent = `${charCount}/50`;
    }
  }

  triggerFileUpload() {
    // Use ViewChild instead of querySelector
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    } else {
      // Fallback in case ViewChild isn't ready
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFileName = file.name;
      // Here you can handle the image upload logic
      // For example, convert to base64 or upload to server
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // this.uploadedImage = e.target.result;
        console.log('Image selected:', file.name);
      };
      reader.readAsDataURL(file);
    }
  }
}
