import React, { useState, useEffect } from 'react';
import AddressService from '../services/addressService';

export default function APIAddressSelector({ onAddressChange }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [specificAddress, setSpecificAddress] = useState('');
  
  const [loading, setLoading] = useState({
    provinces: true,
    districts: false,
    wards: false
  });

  const [errors, setErrors] = useState({
    provinces: '',
    districts: '',
    wards: ''
  });

  // Load provinces khi component mount
  useEffect(() => {
    loadProvinces();
  }, []);

  const loadProvinces = async () => {
    setLoading(prev => ({ ...prev, provinces: true }));
    setErrors(prev => ({ ...prev, provinces: '' }));
    
    try {
      const provincesData = await AddressService.getProvinces();
      setProvinces(provincesData);
      
      if (provincesData.length === 0) {
        setErrors(prev => ({ ...prev, provinces: 'Không thể tải danh sách tỉnh thành' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, provinces: 'Lỗi kết nối API tỉnh thành' }));
    }
    
    setLoading(prev => ({ ...prev, provinces: false }));
  };

  const handleProvinceChange = async (e) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode);
    setSelectedDistrict('');
    setSelectedWard('');
    setDistricts([]);
    setWards([]);
    setErrors(prev => ({ ...prev, districts: '', wards: '' }));
    
    if (provinceCode) {
      setLoading(prev => ({ ...prev, districts: true }));
      try {
        const districtsData = await AddressService.getDistricts(provinceCode);
        setDistricts(districtsData);
        
        if (districtsData.length === 0) {
          setErrors(prev => ({ ...prev, districts: 'Không tìm thấy quận/huyện cho tỉnh này' }));
        }
      } catch (error) {
        setErrors(prev => ({ ...prev, districts: 'Lỗi khi tải danh sách quận/huyện' }));
        setDistricts([]);
      }
      setLoading(prev => ({ ...prev, districts: false }));
    }
    
    updateAddress(provinceCode, '', '', specificAddress);
  };

  const handleDistrictChange = async (e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    setSelectedWard('');
    setWards([]);
    
    if (districtCode) {
      setLoading(prev => ({ ...prev, wards: true }));
      try {
        const wardsData = await AddressService.getWards(districtCode);
        setWards(wardsData);
      } catch (error) {
        setWards([]);
      }
      setLoading(prev => ({ ...prev, wards: false }));
    }
    
    updateAddress(selectedProvince, districtCode, '', specificAddress);
  };

  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    setSelectedWard(wardCode);
    updateAddress(selectedProvince, selectedDistrict, wardCode, specificAddress);
  };

  const handleSpecificAddressChange = (e) => {
    const specific = e.target.value;
    setSpecificAddress(specific);
    updateAddress(selectedProvince, selectedDistrict, selectedWard, specific);
  };

  const updateAddress = (provinceCode, districtCode, wardCode, specific) => {
    const province = provinces.find(p => p.code === provinceCode);
    const district = districts.find(d => d.code === districtCode);
    const ward = wards.find(w => w.code === wardCode);

    const addressData = {
      province: province ? { 
        code: province.code, 
        name: province.name
      } : null,
      district: district ? { 
        code: district.code, 
        name: district.name
      } : null,
      ward: ward ? { 
        code: ward.code, 
        name: ward.name
      } : null,
      specific: specific || '',
      fullAddress: [
        specific,
        ward?.name,
        district?.name,
        province?.name
      ].filter(Boolean).join(', ')
    };

    if (onAddressChange) {
      onAddressChange(addressData);
    }
  };

  return (
    <div className="space-y-3">
      <div className="block text-xs text-gray-600 mb-1">Địa chỉ giao hàng *</div>
      
      {/* Tỉnh/Thành phố */}
      <div>
        <select
          value={selectedProvince}
          onChange={handleProvinceChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-honvietRed focus:border-transparent"
          disabled={loading.provinces}
        >
          <option value="">
            {loading.provinces ? 'Đang tải tỉnh/thành phố...' : 'Chọn tỉnh/thành phố'}
          </option>
          {provinces.map(province => (
            <option key={province.code} value={province.code}>
              {province.name}
            </option>
          ))}
        </select>
        {errors.provinces && (
          <div className="text-red-500 text-sm mt-1">{errors.provinces}</div>
        )}
      </div>

      {/* Quận/Huyện */}
      <div>
        <select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-honvietRed focus:border-transparent"
          disabled={!selectedProvince || loading.districts}
        >
          <option value="">
            {loading.districts ? 'Đang tải quận/huyện...' : 'Chọn quận/huyện'}
          </option>
          {districts.map(district => (
            <option key={district.code} value={district.code}>
              {district.name}
            </option>
          ))}
        </select>
        {errors.districts && (
          <div className="text-red-500 text-sm mt-1">{errors.districts}</div>
        )}
        {!loading.districts && selectedProvince && districts.length === 0 && !errors.districts && (
          <div className="text-yellow-600 text-sm mt-1">Không có dữ liệu quận/huyện cho tỉnh này</div>
        )}
      </div>

      {/* Phường/Xã */}
      <div>
        <select
          value={selectedWard}
          onChange={handleWardChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-honvietRed focus:border-transparent"
          disabled={!selectedDistrict || loading.wards}
        >
          <option value="">
            {loading.wards ? 'Đang tải phường/xã...' : 'Chọn phường/xã'}
          </option>
          {wards.map(ward => (
            <option key={ward.code} value={ward.code}>
              {ward.name}
            </option>
          ))}
        </select>
      </div>

      {/* Địa chỉ cụ thể */}
      <div>
        <input
          type="text"
          placeholder="Số nhà, tên đường, ngõ, thôn/ấp (nếu có)..."
          value={specificAddress}
          onChange={handleSpecificAddressChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-honvietRed focus:border-transparent"
        />
      </div>

      {/* Preview địa chỉ đầy đủ */}
      {(selectedProvince || selectedDistrict || selectedWard || specificAddress) && (
        <div className="mt-3 p-3 bg-gray-50 border rounded-md">
          <div className="text-sm font-medium text-gray-700 mb-1">Địa chỉ đầy đủ:</div>
          <div className="text-sm text-gray-600">
            {[
              specificAddress,
              wards.find(w => w.code === selectedWard)?.name,
              districts.find(d => d.code === selectedDistrict)?.name,
              provinces.find(p => p.code === selectedProvince)?.name
            ].filter(part => part && !part.startsWith('undefined')).join(', ') || 'Chưa đầy đủ thông tin'}
          </div>
        </div>
      )}

      {/* Thông báo lỗi kết nối */}
      {errors.provinces && (
        <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-200 rounded">
          ❌ {errors.provinces}
        </div>
      )}
      
      {loading.provinces && provinces.length === 0 && (
        <div className="text-blue-500 text-sm p-3 bg-blue-50 border border-blue-200 rounded">
          ⏳ Đang kết nối đến server... Vui lòng đợi trong giây lát.
        </div>
      )}
    </div>
  );
}
