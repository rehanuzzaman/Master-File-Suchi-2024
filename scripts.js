document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const itemCodeInput = document.getElementById('itemCode');
    const itemNameInput = document.getElementById('itemName');
    const sizeInput = document.getElementById('size');
    const modelInput = document.getElementById('model');
    const searchBtn = document.getElementById('searchBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    const resultsCount = document.querySelector('.results-count');
    
    let products = [];
    
    // Load product data
    fetch('product.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            displayResults(products); // Display all products initially
        })
        .catch(error => {
            console.error('Error loading product data:', error);
            resultsCount.textContent = 'Error loading product data';
        });
    
    // Search function
    function searchProducts() {
        const itemCode = itemCodeInput.value.trim().toLowerCase();
        const itemName = itemNameInput.value.trim().toLowerCase();
        const size = sizeInput.value.trim().toLowerCase();
        const model = modelInput.value.trim().toLowerCase();
        
        const filteredProducts = products.filter(product => {
            const matchesItemCode = itemCode === '' || 
                (product['ITEM CODE'] && product['ITEM CODE'].toString().toLowerCase().includes(itemCode));
            const matchesItemName = itemName === '' || 
                (product['PRODUCT NAME'] && product['PRODUCT NAME'].toLowerCase().includes(itemName));
            const matchesSize = size === '' || 
                (product['Size'] && product['Size'].toString().toLowerCase().includes(size));
            const matchesModel = model === '' || 
                (product['Model'] && product['Model'].toString().toLowerCase().includes(model));
            
            return matchesItemCode && matchesItemName && matchesSize && matchesModel;
        });
        
        displayResults(filteredProducts);
    }
    
    // Display results in table
    function displayResults(productsToDisplay) {
        resultsTable.innerHTML = '';
        
        if (productsToDisplay.length === 0) {
            const row = resultsTable.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 9;
            cell.textContent = 'No products found matching your criteria';
            cell.style.textAlign = 'center';
            cell.style.padding = '20px';
            cell.style.color = 'var(--dark-gray)';
        } else {
            productsToDisplay.forEach(product => {
                const row = resultsTable.insertRow();
                
                // Create cells for each property
                const properties = [
                    'LC', 'ITEM CODE', 'PRODUCT NAME', 'Size', 'Model', 
                    'Qty', 'Unit RMB', 'Total RMB'
                ];
                
                properties.forEach(prop => {
                    const cell = row.insertCell();
                    cell.textContent = product[prop] !== undefined ? product[prop] : '-';
                    
                    // Right-align numeric columns
                    if (['Qty', 'Unit RMB', 'Total RMB'].includes(prop)) {
                        cell.style.textAlign = 'right';
                    }
                });
            });
        }
        
        resultsCount.textContent = `${productsToDisplay.length} item${productsToDisplay.length !== 1 ? 's' : ''} found`;
    }
    
    // Reset search
    function resetSearch() {
        itemCodeInput.value = '';
        itemNameInput.value = '';
        sizeInput.value = '';
        modelInput.value = '';
        displayResults(products);
    }
    
    // Event listeners
    searchBtn.addEventListener('click', searchProducts);
    resetBtn.addEventListener('click', resetSearch);
    
    // Allow search on Enter key in any input field
    [itemCodeInput, itemNameInput, sizeInput, modelInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    });
});