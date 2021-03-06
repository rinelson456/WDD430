import { Component, OnInit } from '@angular/core';
import {  FormArray, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Resume } from '../resume.model';
import { ResumeService } from '../resume.service';

@Component({
  selector: 'app-resume-edit',
  templateUrl: './resume-edit.component.html',
  styleUrls: ['./resume-edit.component.css']
})
export class ResumeEditComponent implements OnInit {
  id: number;
  editMode = false;
  resumeForm: FormGroup;
  resume: Resume
  originalResume: Resume;

  constructor(private route: ActivatedRoute, private resumeService: ResumeService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params)=> {
      this.id =+params['id'];
      if (this.id == null){
        this.editMode = false;
        return
      }
      const index = this.id
      this.originalResume = this.resumeService.getResume(index)
      console.log(this.originalResume)
      if (this.originalResume == null){
        return
      }
      this.editMode = true;
      this.resume = JSON.parse(JSON.stringify(this.originalResume));

      })
  }

  onSubmit(form: NgForm){
    console.log(this.editMode)
    const value = form.value;
    const id = this.id;
    const newResume = new Resume(value.name, value.date, value.role, id, value.description,);
    if(this.editMode == true){
      this.resumeService.updateResume(this.originalResume, newResume)
    } else{
      this.resumeService.addResume(newResume);
    }
    this.onCancel()
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.route})
  }

}

