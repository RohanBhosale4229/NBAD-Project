import { Component, OnInit } from '@angular/core';
import { JulService } from '../services/jul.service';
import { model } from '../model';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-july',
  templateUrl: './july.component.html',
  styleUrls: ['./july.component.css']
})
export class JulyComponent implements OnInit {
  july!: model[];
  editState: boolean = false;
  julToEdit!: model | null;
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

  constructor(private julyService: JulService) {}

  ngOnInit(): void {
    let current_user: model[]=[];
    this.julyService.getJuly().subscribe(july =>{

      this.july = july;
      for(let i =0; i< this.july.length;i++){
        if(this.july[i].id===localStorage.getItem('userid')){
          current_user.push(this.july[i])
        }
      }
      this.july=current_user;
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
      for (let i = 0; i < this.july.length; i++){
        this.dataSource.datasets[0].data[i] = this.july[i].value;
        this.dataSource.labels[i] = this.july[i].title;
        this.dataSource.datasets[0].backgroundColor[i] = this.randomColors();
      }
    }
  deleteJuly(event: any, j: model){
    this.julyService.deleteJuly(j);
    this.clearState();
    
  }
  editJuly(event: any, j: model){
    this.editState = true;
    this.julToEdit = j;
  }
  clearState(){
    this.editState = false;
    this.julToEdit = null;
  }
  updateJuly(j: model){
    this.julyService.updateJuly(j);
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
