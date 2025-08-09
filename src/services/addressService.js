// API free để lấy dữ liệu tỉnh thành Việt Nam - thử API khác
const ADDRESS_API_BASE = 'https://esgoo.net/api-tinhthanh';
const BACKUP_API_BASE = 'https://vapi.vnappmob.com/api';

class AddressService {
  // Lấy danh sách tỉnh thành với API mới
  static async getProvinces() {
    try {
      // Thử API mới trước
      let response = await fetch(`${ADDRESS_API_BASE}/1/0.htm`);
      
      if (!response.ok) {
        // Fallback sang API backup
        response = await fetch(`${BACKUP_API_BASE}/province`);
      }
      
      const data = await response.json();
      
      // Xử lý dữ liệu tùy theo API
      if (data.data) {
        // API esgoo.net format
        return data.data.map(province => ({
          code: province.id.toString(),
          name: province.name,
          division_type: 'Tỉnh',
          full_name: province.full_name || province.name
        }));
      } else if (data.results) {
        // API vnappmob format
        return data.results.map(province => ({
          code: province.province_id.toString(),
          name: province.province_name,
          division_type: province.province_type || 'Tỉnh',
          full_name: province.province_name
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tỉnh thành:', error);
      return [];
    }
  }

  // Lấy danh sách quận/huyện theo tỉnh với API mới
  static async getDistricts(provinceCode) {
    try {
      // Thử API esgoo.net trước
      let response = await fetch(`${ADDRESS_API_BASE}/2/${provinceCode}.htm`);
      let data;
      
      if (!response.ok) {
        // Fallback sang API vnappmob
        response = await fetch(`${BACKUP_API_BASE}/province/district/${provinceCode}`);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      data = await response.json();
      
      // Xử lý dữ liệu tùy theo API
      if (data.data) {
        // API esgoo.net format
        return data.data.map(district => ({
          code: district.id.toString(),
          name: district.name,
          division_type: district.name.includes('Quận') ? 'Quận' : 'Huyện',
          full_name: district.full_name || district.name
        }));
      } else if (data.results) {
        // API vnappmob format
        return data.results.map(district => ({
          code: district.district_id.toString(),
          name: district.district_name,
          division_type: district.district_type || 'Huyện',
          full_name: district.district_name
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách quận/huyện:', error);
      return [];
    }
  }

  // Lấy danh sách phường/xã theo quận/huyện với API mới
  static async getWards(districtCode) {
    try {
      // Thử API esgoo.net trước
      let response = await fetch(`${ADDRESS_API_BASE}/3/${districtCode}.htm`);
      let data;
      
      if (!response.ok) {
        // Fallback sang API vnappmob
        response = await fetch(`${BACKUP_API_BASE}/province/ward/${districtCode}`);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      data = await response.json();
      
      // Xử lý dữ liệu tùy theo API
      if (data.data) {
        // API esgoo.net format
        return data.data.map(ward => ({
          code: ward.id.toString(),
          name: ward.name,
          division_type: ward.name.includes('Phường') ? 'Phường' : 'Xã',
          full_name: ward.full_name || ward.name
        }));
      } else if (data.results) {
        // API vnappmob format
        return data.results.map(ward => ({
          code: ward.ward_id.toString(),
          name: ward.ward_name,
          division_type: ward.ward_type || 'Xã',
          full_name: ward.ward_name
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phường/xã:', error);
      return [];
    }
  }

  // Lấy toàn bộ dữ liệu đầy đủ của một tỉnh (bao gồm districts và wards)
  static async getFullProvinceData(provinceCode) {
    try {
      const response = await fetch(`${ADDRESS_API_BASE}/p/${provinceCode}?depth=3`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu đầy đủ tỉnh:', error);
      return null;
    }
  }

  // Lấy toàn bộ dữ liệu đầy đủ của một quận/huyện (bao gồm wards)
  static async getFullDistrictData(districtCode) {
    try {
      const response = await fetch(`${ADDRESS_API_BASE}/d/${districtCode}?depth=2`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu đầy đủ quận/huyện:', error);
      return null;
    }
  }

  // Lấy thông tin chi tiết một tỉnh/thành phố
  static async getProvinceDetail(provinceCode) {
    try {
      const response = await fetch(`${ADDRESS_API_BASE}/p/${provinceCode}`);
      return await response.json();
    } catch (error) {
      console.error('Lỗi khi lấy thông tin tỉnh:', error);
      return null;
    }
  }

  // Lấy thông tin chi tiết một quận/huyện
  static async getDistrictDetail(districtCode) {
    try {
      const response = await fetch(`${ADDRESS_API_BASE}/d/${districtCode}`);
      return await response.json();
    } catch (error) {
      console.error('Lỗi khi lấy thông tin quận/huyện:', error);
      return null;
    }
  }

  // Lấy thông tin chi tiết một phường/xã
  static async getWardDetail(wardCode) {
    try {
      const response = await fetch(`${ADDRESS_API_BASE}/w/${wardCode}`);
      return await response.json();
    } catch (error) {
      console.error('Lỗi khi lấy thông tin phường/xã:', error);
      return null;
    }
  }

  // Tìm kiếm địa chỉ
  static async searchAddress(keyword) {
    try {
      const provinces = await this.getProvinces();
      const results = provinces.filter(province => 
        province.name.toLowerCase().includes(keyword.toLowerCase()) ||
        province.codename.toLowerCase().includes(keyword.toLowerCase())
      );
      return results;
    } catch (error) {
      console.error('Lỗi khi tìm kiếm địa chỉ:', error);
      return [];
    }
  }
}

export default AddressService;
