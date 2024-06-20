import { Component, OnDestroy, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../shared/service/report.service';
import { Building } from '../shared/model/building.model';
import { ApiResponse } from '../shared/service/api.service';
import { Subject, takeUntil } from 'rxjs';
import { RoomOccupancy } from '../shared/model/room-occupancy.model';
import { NoShow } from '../shared/model/no-show.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-report-dashboard',
  standalone: true,
  imports: [
    NgxEchartsModule, 
    CommonModule, 
    FormsModule,
    LucideAngularModule,
  ],
  templateUrl: './report-dashboard.component.html',
  styleUrl: './report-dashboard.component.scss'
})
export class ReportDashboardComponent implements OnInit, OnDestroy {
  public selectedYear: number = new Date().getFullYear();
  public buildings: Building[] = []
  public selectedBuilding!: string;
  public years: number[] = [];
  public roomOccupancyData: RoomOccupancy[] = [];
  public noShowData: NoShow[] = [];
  public mostUsagesPieOptions!: EChartsOption;
  public leasUsagesPieOptions!: EChartsOption;
  public heatmapOptions!: EChartsOption;
  private maxDataValue: number = 0;
  private unsubscribe$: Subject<void> = new Subject<void>();
    
  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.getYears();
    this.getBuildings();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private setChartOptions(): void {
    this.setMostUsagesPieChartOptions();
    this.setLeastUsagesPieChartOptions();
    this.setHeatmapOptions();
  }
  
  public getRoomOccupancyData(): void {
    this.reportService.getRoomOccupancyData(this.selectedBuilding, this.selectedYear)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((response: ApiResponse<RoomOccupancy[]>) => {
      this.roomOccupancyData = response.payload;
      this.setChartOptions();
    });
  }

  public getNoShowData(): void {
    this.reportService.getNoShowData(this.selectedBuilding, this.selectedYear)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((response: ApiResponse<NoShow[]>) => {
      this.noShowData = response.payload;
    });
  }

  public getBuildings(): void {
    this.reportService.getBuildings()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((response: ApiResponse<Building[]>) => {
      this.buildings = response.payload;
      this.selectedBuilding = this.buildings[0].name;
      this.getRoomOccupancyData();
      this.getNoShowData();
    });
  }

  private getYears(): void {
    for (let i = 0; i < 3; i++) {
      this.years.push(this.selectedYear - i);
    }
  }

  public onChangeFilter(): void {
    this.getRoomOccupancyData();
    this.getNoShowData();
  }

  private setHeatmapOptions(): void {
    const months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
    const rooms: string[] = this.roomOccupancyData.map(item => item.room);
    const heatmapData = this.createHeatmapData(rooms, months);

    this.heatmapOptions = {
      title: {
        text: 'Heatmap van de ruimtebezetting',
        top: '5%',
        left: 'center',
        textStyle: {
          color: 'black'
        }
      },
      tooltip: {
        position: 'top',
      },
      grid: {
        height: '60%',
        top: '15%',
        containLabel: true,
    },
      xAxis: {
        type: 'category',
        data: rooms,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: months,
        splitArea: {
          show: true
        }
      },
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          start: 45,
          end: 65, 
          height: 20,
          bottom: 0,
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          start: 0,
          end: 100,
      }
      ],
      visualMap: {
        min: 0,
        max: this.maxDataValue,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '10%',
      },
      series: [{
        name: 'Bezetting',
        type: 'heatmap',
        data: heatmapData,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
  }
  
  public onHeatmapInit(chart: any): void {
    chart.on('dataZoom', () => {
      const option = chart.getOption();
      const zoom = option.dataZoom[0];
      const labelVisabilityStart = 20;
      const isZoomedIn = zoom.end - zoom.start <= labelVisabilityStart; 

      option.series[0].label.show = isZoomedIn;
      chart.setOption(option);
    });
  }

  private createHeatmapData(rooms: string[], months: string[]): number[][] {
    const matrix: number[][] = Array.from({ length: rooms.length }, () => Array(months.length).fill(0));
    const data: number[][] = [];
    this.maxDataValue = 0;

    this.roomOccupancyData.forEach((item) => {
      const room = rooms.indexOf(item.room);
      const month = new Date(item.date).getMonth();
      matrix[room][month] = item.numberOfUsages;
    });

    for (let i = 0; i < rooms.length; i++) {
      for (let j = 0; j < months.length; j++) {
        let value = matrix[i][j];
        data.push([i, j, value]);
        this.maxDataValue = Math.max(this.maxDataValue, value);
      }
    }

    return data;
  }

  private setMostUsagesPieChartOptions(): void {
    const chartData = this.roomOccupancyData.sort((a, b) => b.numberOfUsages - a.numberOfUsages);
    const top5 = chartData.slice(0, 5);
    this.mostUsagesPieOptions = this.setPieChartOptions('Meest gebruikte ruimtes', top5);
  }

  private setLeastUsagesPieChartOptions(): void {
    const chartData = this.roomOccupancyData.sort((a, b) => a.numberOfUsages - b.numberOfUsages);
    const bottom5 = chartData.slice(0, 5);
    this.leasUsagesPieOptions = this.setPieChartOptions('Minst gebruikte ruimtes', bottom5);
  }

  private setPieChartOptions(title: string, chartData: RoomOccupancy[]): EChartsOption {
    const data = chartData.map(item => ({
      name: item.room,
      value: item.numberOfUsages
    }));

    return {
      title: {
        text: title,
        left: 'center',
        top: '5%',
        textStyle: {
          color: 'black'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'horizontal',
        top: '15%',
      },
      series: [
        {
          name: 'bezetting',
          type: 'pie',
          radius: '50%',
          top: '10%',
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }
}
