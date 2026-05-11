import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false //true makes it pure and false makes it impure
})
export class FilterPipe implements PipeTransform {
  // transform(items: any[], searchText: string): any[] {
  //   if (!items) return [];
  //   if (!searchText) return items;
  //   if((searchText.length)%3==0) return;
  //   return items.filter((x)=>{
  //        return x.name.toLowerCase().includes(searchText.toLowerCase())
  //       })
  //  }
  transform(items: any[], filterdata: string): any[] {
    if(!items) return [];
    if(!filterdata) return items;
    // if((filterdata.length)%3!=0) return items;
     filterdata = filterdata.toString().toLowerCase();
     return items.filter( it => {
       console.log(it);
     return JSON.stringify(it).toLowerCase().includes(filterdata);
      });
      }
}