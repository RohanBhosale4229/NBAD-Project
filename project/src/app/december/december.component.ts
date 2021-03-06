import { Component, OnInit } from '@angular/core';
import { DecService } from '../services/dec.service';
import { model } from '../model';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-december',
  templateUrl: './december.component.html',
  styleUrls: ['./december.component.css']
})
export class DecemberComponent implements OnInit {
  december!: model[];
  editState: boolean = false;
  decToEdit!: model | null;
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

  constructor(private decemberService: DecService) {}

  ngOnInit(): void {
    let current_user: model[]=[];
    this.decemberService.getDecember().subscribe(december =>{
      this.december = december;
      for(let i =0; i< this.december.length;i++){
        if(this.december[i].id===localStorage.getItem('userid')){
          current_user.push(this.december[i])
        }
      }
      this.december=current_user;
      current_user=[]
      this.getBudget();
      setTimeout(() => {
        this.createPie();
        this.createBar();
        this.createLine();
      }, 300);
      })
    }
    getBudget(){
      for (let i = 0; i < this.december.length; i++){
        this.dataSource.datasets[0].data[i] = this.december[i].value;
        this.dataSource.labels[i] = this.december[i].title;
        this.dataSource.datasets[0].backgroundColor[i] = this.randomColors();
      }
    }
  deleteDecember(event: any, j: model){
    this.decemberService.deleteDecember(j);
    this.clearState();
    
  }
  editDecember(event: any, j: model){
    this.editState = true;
    this.decToEdit = j;
  }
  clearState(){
    this.editState = false;
    this.decToEdit = null;
  }
  updateDecember(j: model){
    this.decemberService.updateDecember(j);
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


