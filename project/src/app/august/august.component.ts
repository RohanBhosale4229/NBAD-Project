import { Component, OnInit } from '@angular/core';
import { AugService } from '../services/aug.service';
import { model } from '../model';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-august',
  templateUrl: './august.component.html',
  styleUrls: ['./august.component.css']
})
export class AugustComponent implements OnInit {
  august!: model[];
  editState: boolean = false;
  augToEdit!: model | null;
  public myPieChart: any
  public myBarChart: any
  public myLineChart: any
  public dataSource = {
    datasets: [
        {
            data: [],
            backgroundColor: [

            ],
        }
    ],
    labels: [],
    fill: false
  } as any


  constructor(private augustService: AugService) {}

  ngOnInit(): void {
    let current_user: model[]=[];
    this.augustService.getAugust().subscribe(august =>{
      this.august = august;
      for (let i =0; i<this.august.length;i++){
        if(this.august[i].id===localStorage.getItem('user')){
          current_user.push(this.august[i])
        }
      }
      this.august=current_user;
      current_user=[];
      this.getBudget();
      setTimeout(() => {
        this.createPie();
        this.createBar();
        this.createLine();
      }, 300);
      })
    }
    getBudget(){
      for (let i = 0; i < this.august.length; i++){
        this.dataSource.datasets[0].data[i] = this.august[i].value;
        this.dataSource.labels[i] = this.august[i].title;
        this.dataSource.datasets[0].backgroundColor[i] = this.randomColors();
      }
    }
  deleteAugust(event: any, j: model){
    this.augustService.deleteAugust(j);
    this.clearState();
    
  }
  editAugust(event: any, j: model){
    this.editState = true;
    this.augToEdit = j;
  }
  clearState(){
    this.editState = false;
    this.augToEdit = null;
  }
  updateAugust(j: model){
    this.augustService.updateAugust(j);
    this.clearState();
  }
  createPie() {
    if (this.myPieChart){
      this.myPieChart.destroy()
    }
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
    });
  }
    createBar() {
      if(this.myBarChart){
        this.myBarChart.destroy()
      }
      const ctx = document.getElementById('myChart1') as HTMLCanvasElement;
      const myPieChart = new Chart(ctx, {
          type: 'bar',
          data: this.dataSource,
          options: {

            scales: {
              xAxes:[{
                stacked:true
              }],
              yAxes: [
                {
                  stacked:true
                }]
            }
          }
      });
    }
      createLine() {
        if(this.myLineChart){
          this.myLineChart.destroy()
        }
        const ctx = document.getElementById('myChart2') as HTMLCanvasElement;
        const myPieChart = new Chart(ctx, {
            type: 'line',
            data: this.dataSource,
            options: {
              legend: {
                display: false
              },
              scales: {
                yAxes: [
                  {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                  }
                ]
              },
              elements: {
                  line: {
                          fill: false
                  }
              }
          }
        });
}
randomColors(){
  const r=Math.floor(Math.random()*255);
  const g=Math.floor(Math.random()*255);
  const b=Math.floor(Math.random()*255);
  return 'rgb('+r+','+g+','+b+')';
}
}

