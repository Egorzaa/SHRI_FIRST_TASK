export function getPopupContent(obj) {
    
    const htmlStatus = obj.isActive
        ? `<div class="details-state details-state_active">active</div>`
        : `<div class="details-state details-state_defective">defective</div>`

    let content = `<div class="details-info">
        <div class="details-info">
            <div class="details-title">base station</div>
            <div class="details-info">${obj.serialNumber}</div>
            ${htmlStatus}
            <div class="details-state details-state_connections">
                connections: ${obj.connections}
            </div>
        </div>
        <div class="details-info">
            <div class="details-label">connections</div>
            <canvas id ="myChart" class="details-chart" width="400" height="400" />
        </div>`
    return content;
}