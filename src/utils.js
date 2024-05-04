export const processCSV = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const rows = text.split('\n').slice(1); // Remove header row
        const suppliers = rows.map((row) => {
          const [name, unitWeight, unitPrice, unitQuantity] = row.split(',');
          return {
            name,
            unitWeight: parseInt(unitWeight),
            unitPrice: parseFloat(unitPrice),
            unitQuantity: parseInt(unitQuantity),
          };
        });
        resolve(suppliers);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };
  