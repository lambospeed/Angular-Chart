import { Component, OnInit, Input } from '@angular/core';
import { TabsComponent } from '../tabs.component';

@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {

  public active: boolean = false;

  @Input() tabTitle;

  constructor(tabs:TabsComponent) {
    tabs.addTab(this);
  }

  ngOnInit() {
  }

}
