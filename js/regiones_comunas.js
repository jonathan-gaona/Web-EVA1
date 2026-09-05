const regionesYComunas = [
    {
        region: "Región Metropolitana de Santiago",
        comunas: ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto"]
    },
    {
        region: "Región de Valparaíso",
        comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"]
    },
    {
        region: "Región del Biobío",
        comunas: ["Concepción", "Talcahuano", "Los Ángeles", "Chillán"]
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const regionSelect = document.getElementById("region");
    const comunaSelect = document.getElementById("comuna");

    if (regionSelect && comunaSelect) {
        // Cargar regiones
        regionesYComunas.forEach(item => {
            const opt = document.createElement("option");
            opt.value = item.region;
            opt.textContent = item.region;
            regionSelect.appendChild(opt);
        });

        // Evento al cambiar región
        regionSelect.addEventListener("change", (e) => {
            const selectedRegion = e.target.value;
            comunaSelect.innerHTML = '<option value="">Seleccione Comuna...</option>';

            if (!selectedRegion) {
                comunaSelect.disabled = true;
                return;
            }

            const data = regionesYComunas.find(r => r.region === selectedRegion);
            if (data) {
                data.comunas.forEach(comuna => {
                    const opt = document.createElement("option");
                    opt.value = comuna;
                    opt.textContent = comuna;
                    comunaSelect.appendChild(opt);
                });
                comunaSelect.disabled = false;
            }
        });
    }
});