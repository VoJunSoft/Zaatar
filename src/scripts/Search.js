//search by location: item.seller.location.city.includes(searchInput)
export const filterDataByCategoryInLocation = (products,country, category, searchInput, city) =>{
    const productsTemp = filterDataByCategoryInCountry(products,country, category, searchInput)
    if(city === 'الكل' || city === '')
        return productsTemp
    else 
        return productsTemp.filter(item=> item.seller.location.city === city)
}

//Filter data based on country, category, searchInput
export const filterDataByCategoryInCountry = (products, country, category, searchInput) =>{
    const productsByCountry = country === 'Global' ? products : products.filter((item)=> item.seller.location.country === country)
    if(searchInput===''){
        if(category === 'الكل')
            return productsByCountry
        else
            return productsByCountry.filter(item=> item.category === category)
    }else{
        if(category === 'الكل')            
            return productsByCountry.filter(item=> item.category.includes(searchInput) || item.product_name.includes(searchInput) || item.seller.name.includes(searchInput))
        else
             return productsByCountry.filter(item=> (item.category.includes(searchInput) || item.product_name.includes(searchInput) || item.seller.name.includes(searchInput)) && item.category === category)
    }
}

//Filter data based on category and search input value 
export const filterDataByCategory = (products, category, searchInput) =>{
    if(searchInput===''){
        if(category === 'الكل')
            return products
        else
            return products.filter(item=> item.category === category)
    }else{
        if(category === 'الكل')            
            return products.filter(item=> item.category.includes(searchInput) || item.product_name.includes(searchInput) || item.seller.name.includes(searchInput || item.seller.location.city.includes(searchInput)))
        else
             return products.filter(item=> (item.category.includes(searchInput) || item.product_name.includes(searchInput) || item.seller.name.includes(searchInput) || item.seller.location.city.includes(searchInput)) && item.category === category)
    }
}

//Filter data based on search input value 
export const filterWorkshopsBaseOnSearch = (workshops, searchInput) =>{
    if(searchInput==='')
            return workshops
        else
            return workshops.filter(item=>  item.title.includes(searchInput) || 
                                            item.location.city.includes(searchInput) || 
                                            item.seller.name.includes(searchInput)
                                    )
}

//Filter data based on search input value 
export const filterStoresBaseOnSearch = (stores, searchInput) =>{
    if(searchInput==='')
            return stores
        else
            return stores.filter(item=> item.name.includes(searchInput) || item.location.city.includes(searchInput))
}