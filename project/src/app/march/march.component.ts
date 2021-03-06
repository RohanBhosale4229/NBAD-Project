import { Component, OnInit } from '@angular/core';
import { MarService } from '../services/mar.service';
import { model } from '../model';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-march',
  templateUrl: './march.component.html',
  styleUrls: ['./march.component.css']
})
export class MarchComponent implements OnInit {
  march!: model[];
  editState: boolean = false;
  marToEdit!: model | null;

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


  constructor(private marchService: MarService) {}

  ngOnInit(): void {
    let current_user: model[]=[];
    this.marchService.getMarch().subscribe(march =>{

      this.march = march;
      for(let i =0; i< this.march.length;i++){
        if(this.march[i].id===localStorage.getItem('userid')){
          current_user.push(this.march[i])
        }
      }
      this.march=current_user;
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
      for (let i = 0; i < this.march.length; i++){

        this.dataSource.datasets[0].data[i] = this.march[i].value;
        this.dataSource.labels[i] = this.march[i].title;
        this.dataSource.datasets[0].backgroundColor[i] = this.randomColors();

    }
    }

  deleteMarch(event: any, j: model){
    this.marchService.deleteMarch(j);
    this.clearState();
    
  }
  editMarch(event: any, j: model){
    this.editState = true;
    this.marToEdit = j;
  }
  clearState(){
    this.editState = false;
    this.marToEdit = null;
  }
  updateMarch(j: model){
    this.marchService.updateMarch(j);
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

