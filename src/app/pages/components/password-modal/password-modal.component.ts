import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NewsService } from 'src/service/news.service';

@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.css']
})
export class PasswordModalComponent {
  newPassword: string = '';
  confirmPassword: string = '';

  // New properties to manage visibility state
  newPasswordHide = true;
  confirmPasswordHide = true;
  constructor(private dialogRef: MatDialogRef<PasswordModalComponent>, public api: NewsService) {}

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if(this.newPassword !== this.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    let userId=this.api.userId as string
this.api.changePassword(userId,this.newPassword).subscribe(data=>{
  if (data)
    alert('Password changed')
})
    this.dialogRef.close({ newPassword: this.newPassword, confirmPassword: this.confirmPassword });
  }
}
