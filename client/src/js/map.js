/**
 * Hàm khởi tạo (constructor) cho đối tượng trạm sạc.
 * @param {string} name - Tên trạm sạc
 * @param {number} lat - Vĩ độ
 * @param {number} lng - Kinh độ
 * @param {string} connector - Loại cổng sạc (CCS, AC, v.v.)
 * @param {string} status - Trạng thái (available, busy)
 * @param {number} power - Công suất (kW)
 * @param {number} price - Đơn giá (đ/kWh)
 * @param {string} address - Địa chỉ
 * @param {string} distance - Khoảng cách (ví dụ: "1.2km")
 */
function tram(name, lat, lng, connector, status, power, price, address, distance) {
    this.name = name;
    this.lat = lat;
    this.lng = lng;
    this.connector = connector;
    this.status = status;
    this.power = power;
    this.price = price;
    this.address = address;
    this.distance = distance;

    this.hienThiThongTin = function() {
        console.log(`--- Thông tin trạm sạc ---`);
        console.log(`Tên: ${this.name}`);
        console.log(`Địa chỉ: ${this.address}`);
        console.log(`Trạng thái: ${this.status === 'available' ? 'Còn trống' : 'Đang bận'}`);
        console.log(`Loại sạc: ${this.connector} (${this.power}kW)`);
        console.log(`Giá: ${this.price}đ/kWh`);
    };

    this.conTrong = function() {
        return this.status === 'available';
    };

    this.capNhatTrangThai = function(newStatus) {
        this.status = newStatus;
        console.log(`Trạm ${this.name} đã được cập nhật trạng thái thành: ${newStatus}`);
    };
}

let map;
let markers = [];

function initMap() {
    if (typeof google === 'undefined' || !google.maps) {
        console.error("Google Maps API not loaded. Check your API key and billing.");
        return;
    }

    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 10.7769, lng: 106.7009 },
        zoom: 12,
        styles: [
            { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
            { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] }
        ]
    });

    const tramSaiGon1 = new tram("Trạm Sạc Sài Gòn 1", 10.7769, 106.7009, "CCS", "available", 50, 2000, "1 Lê Lợi, Q.1, TP.HCM", "1.2km");
    const tramSaiGon2 = new tram("Trạm Sạc Sài Gòn 2", 10.785, 106.705, "AC", "busy", 30, 1500, "2 Nguyễn Huệ, Q.1, TP.HCM", "2.5km");
    const tramSaiGon3 = new tram("Trạm Sạc Sài Gòn 3", 10.770, 106.690, "CHAdeMO", "available", 100, 2500, "3 Pasteur, Q.1, TP.HCM", "0.8km");
    const tramSaiGon4 = new tram("Trạm Sạc Sài Gòn 4", 10.780, 106.695, "CCS", "busy", 75, 2200, "4 Lê Duẩn, Q.1, TP.HCM", "1.5km");
    const tramSaiGon5 = new tram("Trạm Sạc Sài Gòn 5", 10.775, 106.710, "AC", "available", 40, 1800, "5 Tôn Đức Thắng, Q.1, TP.HCM", "2.0km");

    const stations = [tramSaiGon1, tramSaiGon2, tramSaiGon3, tramSaiGon4, tramSaiGon5];

    const infowindow = new google.maps.InfoWindow({ content: "", maxWidth: 320 });
    stations.forEach((station) => {
        const marker = new google.maps.Marker({
            position: { lat: station.lat, lng: station.lng },
            map: map,
            title: station.name,
            icon: station.status === "available" ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png" : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
        });

        marker.addListener("click", () => {
            const content = `
                <div class="info-window">
                    <h3>${station.name}</h3>
                    <div class="info-details">
                        <p><strong>Loại:</strong> ${station.connector}</p>
                        <p><strong>Trạng thái:</strong> <span class="status ${station.status.toLowerCase()}">${station.status === 'available' ? 'Trống' : 'Đang dùng'}</span></p>
                        <p><strong>Công suất:</strong> ${station.power}kW</p>
                        <p><strong>Giá:</strong> ${station.price}đ/kWh</p>
                        <p><strong>Địa chỉ:</strong> ${station.address}</p>
                    </div>
                    <div class="action-row">
                        <button onclick="bookStation('${station.name}')">Đặt chỗ</button>
                    </div>
                </div>
            `;
            infowindow.setContent(content);
            infowindow.open(map, marker);
        });

        markers.push({ marker, station });
    });

    updateStationList();

    // Khởi tạo Autocomplete với kiểm tra lỗi
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        const autocomplete = new google.maps.places.Autocomplete(searchInput, {
            fields: ["geometry", "name", "formatted_address"],
            types: ["geocode", "establishment"]
        });
        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) {
                console.error("No geometry data available for the selected place.");
                return;
            }
            map.setCenter(place.geometry.location);
            map.setZoom(14);
            console.log("Searched place:", place.name, place.geometry.location); // Debug
            updateStationList(); // Cập nhật danh sách trạm
        });
    } else {
        console.error("Search input element not found.");
    }

    // Khởi tạo dropdown
    initializeDropdowns();
}

// Lấy vị trí hiện tại
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
            map.setCenter(userLocation);
            map.setZoom(14);
            new google.maps.Marker({
                position: userLocation,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                title: 'Vị trí của bạn'
            });
            updateStationList();
        }, () => alert("Không thể lấy vị trí hiện tại."));
    }
}

// Cập nhật danh sách trạm
function updateStationList() {
    const listContent = document.getElementById("listContent");
    if (!listContent) {
        console.error("listContent element not found.");
        return;
    }
    let html = '';

    const visibleStations = markers.filter(item => item.marker.getVisible());

    visibleStations.forEach((item) => {
        const station = item.station;
        html += `
            <div class="station-card">
                <div class="station-header">
                    <h4>${station.name}</h4>
                    <span class="status ${station.status.toLowerCase()}">${station.status === 'available' ? 'Trống' : 'Đang dùng'}</span>
                </div>
                <p class="address">${station.address}</p>
                <p class="details">
                    <i class="fa-solid fa-bolt"></i> ${station.connector} | ${station.power}kW | ${station.price}đ/kWh
                </p>
                <p class="distance">${station.distance}</p>
                <button onclick="bookStation('${station.name}')" class="btn-book">Đặt chỗ</button>
            </div>
        `;
    });

    listContent.innerHTML = html;
    document.getElementById("stationCount").textContent = `${visibleStations.length} trạm`;
}

// Hàm lọc marker
function filterMarkers() {
    const connectorSpan = document.querySelector(".select-menu:nth-child(1) .select span");
    const statusSpan = document.querySelector(".select-menu:nth-child(2) .select span");
    let connector = connectorSpan ? connectorSpan.textContent.trim() : "Tất cả";
    let status = statusSpan ? statusSpan.textContent.trim() : "Trạng thái";

    // Khôi phục giá trị mặc định nếu bị mất
    if (!connector || connector === "") {
        connector = "Tất cả";
        if (connectorSpan) connectorSpan.textContent = connector;
    }
    if (!status || status === "") {
        status = "Trạng thái";
        if (statusSpan) statusSpan.textContent = status;
    }

    // Chuẩn hóa trạng thái
    let statusValue = "all"; // Mặc định không lọc trạng thái
    if (status === "Trống") statusValue = "available";
    else if (status === "Đang dùng") statusValue = "busy";

    markers.forEach(item => {
        const marker = item.marker;
        const station = item.station;
        let show = true;

        // Lọc connector
        if (connector !== "Tất cả" && station.connector !== connector) show = false;
        // Lọc trạng thái chỉ khi có lựa chọn cụ thể
        if (statusValue !== "all" && station.status !== statusValue) show = false;

        marker.setVisible(show);
    });

    updateStationList();
    console.log("Filtered - Connector:", connector, "Status:", status); // Debug
}

// Hàm đặt chỗ
function bookStation(name) {
    alert(`Đặt chỗ trạm ${name} thành công! Sẽ chuyển đến thanh toán ví EV.`);
}