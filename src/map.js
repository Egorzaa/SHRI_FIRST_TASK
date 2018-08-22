import { loadList, loadDetails } from './api';
import { getPopupContent } from './popup';
import { createChart } from './chart';
import { createFilterControl } from './filter';
export function initMap(ymaps, containerId) {
  const myMap = new ymaps.Map(containerId, {
    center: [55.76, 37.64],
    controls: ["zoomControl"],
    zoom: 10
  });
  const myobjectManager = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 64,
    clusterIconLayout: 'default#pieChart', 
  });
  
  myMap.geoObjects.add(myobjectManager);

  loadList().then(data => {
    myobjectManager.add(data);
  });
  
  // filters
  const listBoxControl = createFilterControl(ymaps);
  myMap.controls.add(listBoxControl);
  var filterMonitor = new ymaps.Monitor(listBoxControl.state);
  filterMonitor.add('filters', filters => {
    myobjectManager.setFilter(
      obj => filters[obj.isActive ? 'Active' : 'Defective']
    );
  });

  // details
  myobjectManager.objects.events.add('click', event => {
    const objectId = event.get('objectId');
    const obj = myobjectManager.objects.getById(objectId);
    myobjectManager.objects.balloon.open(objectId);

    loadDetails(objectId).then(data => {
      obj.properties.balloonContentBody = getPopupContent(data);
      myobjectManager.objects.balloon.setData(obj);
      setTimeout(createChart, 150,data);
    });  
  }); 
}
