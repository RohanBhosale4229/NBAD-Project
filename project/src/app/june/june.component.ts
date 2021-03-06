import { Component, OnInit } from '@angular/core';
import { JunService } from '../services/jun.service';
import { model } from '../model';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-june',
  templateUrl: './june.component.html',
  styleUrls: ['./june.component.css']
})
export class JuneComponent implements OnInit {
  june!: model[];
  editState: boolean = false;
  junToEdit!: model | null;
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
  constructor(private juneService: JunService) {}

  ngOnInit(): void {
    let current_user: model[]=[];
    this.juneService.getJune().subscribe(june =>{
      //console.log(june);
      this.june = june;
      for(let i =0; i< this.june.length;i++){
        if(this.june[i].id===localStorage.getItem('userid')){
          current_user.push(this.june[i])
        }
      }
      this.june=current_user;
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
      for (let i = 0; i < this.june.length; i++){
        this.dataSource.datasets[0].data[i] = this.june[i].value;
        this.dataSource.labels[i] = this.june[i].title;
        this.dataSource.datasets[0].backgroundColor[i] = this.randomColors();
      }
    }
  deleteJune(event: any, j: model){
    this.juneService.deleteJune(j);
    this.clearState();
  }
  editJune(event: any, j: model){
    this.editState = true;
    this.junToEdit = j;
  }
  clearState(){
    this.editState = false;
    this.junToEdit = null;
  }
  updateJune(j: model){
    this.juneService.updateJune(j);
    this.clearState();
    location.reload();
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
