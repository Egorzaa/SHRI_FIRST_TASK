export function createFilterControl(ymaps) {
  const items = [
    { title: 'Active'},
    { title: 'Defective'}
  ].map(
    obj =>
      new ymaps.control.ListBoxItem({
        data: { 
          content: obj.title},
        state: { selected: true }
      })
  );
  const listBoxControl = new ymaps.control.ListBox({
    data: { content: 'Filter by state', title: 'Filter by state' },
    items: items,
    state: {
      filters: items.reduce(function(filters, item) {
        filters[item.data.get('content')] = item.isSelected();
        return filters;
      }, {})
    }
  });

  listBoxControl.events.add(['select', 'deselect'], event => {
    var item = event.get('target');
    var filters = ymaps.util.extend({}, listBoxControl.state.get('filters'));
    filters[item.data.get('content')] = item.isSelected();
    listBoxControl.state.set('filters', filters);
  });
  

  return listBoxControl;
}
