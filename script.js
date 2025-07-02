let umpData = {};
let inflasiData = [];

// Load kedua file JSON
Promise.all([
  fetch('assets/ump.json').then(res => res.json()),
  fetch('assets/inflasi.json').then(res => res.json())
]).then(([umpJson, inflasiJson]) => {
  umpJson.forEach(item => {
    // Ubah string UMP ke angka: "3.685.616,00" => 3685616.00
    const umpString = item["Upah Minimum (Rp)"]
      .replace(/\./g, '') // hilangkan titik ribuan
      .replace(',', '.'); // ganti koma menjadi titik desimal

    umpData[item.Provinsi] = parseFloat(umpString);
  });
  inflasiData = inflasiJson;

  // Populate provinsi
  const provinsiSelect = document.getElementById('provinsi');
  // Tambah placeholder "--pilih provinsi--"
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '--pilih provinsi--';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  provinsiSelect.appendChild(defaultOption);

  Object.keys(umpData).forEach(prov => {
    const option = document.createElement('option');
    option.value = prov;
    option.textContent = prov;
    provinsiSelect.appendChild(option);
  });
});

function getAverageInflation(inflasiData) {
  const semuaTahun = inflasiData.map(d => {
    const angka = parseFloat(d.Inflation.replace(',', '.').replace('%', ''));
    return angka / 100;
  });

  const sum = semuaTahun.reduce((acc, val) => acc + val, 0);
  return sum / semuaTahun.length;
}

// Set nilai default input
document.addEventListener('DOMContentLoaded', function () {
  const tahunLahirInput = document.getElementById('tahunLahir');
  const tahunSekarangInput = document.getElementById('tahunSekarang');
  const checkpointUmurInput = document.getElementById('checkpointUmur');

  tahunLahirInput.value = 2003;
  tahunSekarangInput.value = new Date().getFullYear();
  checkpointUmurInput.value = tahunSekarangInput.value - tahunLahirInput.value;

  toggleInputMode();
});

// Format angka input manual jadi format Indonesia
const pengeluaranManualInput = document.getElementById('pengeluaranManual');

pengeluaranManualInput.addEventListener('input', function () {
  const raw = pengeluaranManualInput.value.replace(/\./g, '');
  if (!isNaN(raw) && raw !== '') {
    pengeluaranManualInput.value = parseInt(raw).toLocaleString('id-ID');
  }
});

// Tampilkan input sesuai mode (provinsi/manual)
const modeProvinsi = document.getElementById('modeProvinsi');
const modeManual = document.getElementById('modeManual');
const provinsiGroup = document.getElementById('provinsiGroup');
const manualGroup = document.getElementById('manualGroup');

function toggleInputMode() {
  if (modeProvinsi.checked) {
    provinsiGroup.style.display = 'block';
    manualGroup.style.display = 'none';
    document.getElementById('provinsi').required = true;
    document.getElementById('pengeluaranManual').required = false;
  } else {
    provinsiGroup.style.display = 'none';
    manualGroup.style.display = 'block';
    document.getElementById('provinsi').required = false;
    document.getElementById('pengeluaranManual').required = true;
  }
}

modeProvinsi.addEventListener('change', toggleInputMode);
modeManual.addEventListener('change', toggleInputMode);

['tahunLahir', 'tahunSekarang'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    const tLahir = parseInt(document.getElementById('tahunLahir').value);
    const tSekarang = parseInt(document.getElementById('tahunSekarang').value);
    const checkpointUmurInput = document.getElementById('checkpointUmur');

    if (!isNaN(tLahir) && !isNaN(tSekarang)) {
      const umurSaatIni = tSekarang - tLahir;
      if (umurSaatIni >= 0) {
        checkpointUmurInput.value = umurSaatIni;
      } else {
        checkpointUmurInput.value = '';
      }
    }
  });
});

document.getElementById('formSimulasi').addEventListener('submit', function(e) {
  e.preventDefault();

  const tahunLahir = parseInt(document.getElementById('tahunLahir').value);
  const tahunSekarang = parseInt(document.getElementById('tahunSekarang').value);
  const checkpointUmur = parseInt(document.getElementById('checkpointUmur').value);
  const umurSaatIni = tahunSekarang - tahunLahir;

  if (checkpointUmur < umurSaatIni) {
    alert(`Checkpoint umur (${checkpointUmur}) tidak boleh lebih kecil dari umur saat ini (${umurSaatIni}).`);
    return;
  }

  const sisaTahun = checkpointUmur - umurSaatIni;

  let umpBulanan = 0;
  let provinsi = '-';

  if (modeProvinsi.checked) {
    provinsi = document.getElementById('provinsi').value;
    if (!provinsi) {
      alert('Silakan pilih provinsi terlebih dahulu.');
      return;
    }
    umpBulanan = umpData[provinsi];
  } else {
    const pengeluaranManualRaw = document.getElementById('pengeluaranManual').value.replace(/\./g, '').replace(',', '');
    const pengeluaranManual = parseFloat(pengeluaranManualRaw);
    if (isNaN(pengeluaranManual) || pengeluaranManual <= 0) {
      alert('Mohon masukkan pengeluaran bulanan yang valid.');
      return;
    }
    umpBulanan = pengeluaranManual;
    provinsi = '-';
  }

  const umpTahunan = umpBulanan * 12;
  const inflasiRata2 = getAverageInflation(inflasiData); // Dalam bentuk desimal, misal 0.034
  const mobilCost = 383000000;

  // Hitung biaya pernikahan dengan inflasi
  let biayaPernikahan = 0;
  let rincianPernikahan = '';

  for (let i = 1; i <= 3; i++) {
    const tahunKe = sisaTahun + i;
    const biayaTahun = umpTahunan * Math.pow(1 + inflasiRata2, tahunKe);
    biayaPernikahan += biayaTahun;
    rincianPernikahan += `<li>Tahun ke-${tahunKe}: Rp ${Math.round(biayaTahun).toLocaleString('id-ID', { maximumFractionDigits: 0 })}</li>`;
  }

  const total = 3 * (biayaPernikahan + mobilCost);

  document.getElementById('hasil').innerHTML = `
    <p><strong>Sumber Pengeluaran:</strong> ${modeProvinsi.checked ? `UMP Provinsi (${provinsi})` : 'Input Manual'}</p>
    <p><strong>Pengeluaran Bulanan:</strong> Rp ${umpBulanan.toLocaleString('id-ID')}</p>
    <p><strong>UMP Tahunan:</strong> Rp ${umpTahunan.toLocaleString('id-ID')}</p>
    <p><strong>Rata-rata Inflasi:</strong> ${(inflasiRata2 * 100).toFixed(2)}%</p>
    <p><strong>Sisa Checkpoint Umur:</strong> ${sisaTahun} tahun</p>
    <p><strong>Estimasi Biaya Pernikahan (3 tahun berturut-turut setelah checkpoint umur):</strong></p>
    <ul>${rincianPernikahan}</ul>
    <p><strong>Total Biaya Pernikahan:</strong> Rp ${Math.round(biayaPernikahan).toLocaleString('id-ID', { maximumFractionDigits: 0 })}</p>
    <p><strong>Biaya Mobil:</strong> Rp ${mobilCost.toLocaleString('id-ID')}</p>
    <p style="color:darkblue;"><strong>Total Kebutuhan Dana:</strong> Rp ${Math.round(total).toLocaleString('id-ID', { maximumFractionDigits: 0 })}</p>
  `;
});

