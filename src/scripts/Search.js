
//Filter data based on category and search input value 
//TODO add search by location: item.seller.location.includes(searchInput)
export const filterDataByCategory = (products, category, searchInput) =>{
    if(searchInput===''){
        if(category === 'الكل')
            return products
        else
            return products.filter(item=> item.category === category)
    }else{
        if(category === 'الكل')            
            return products.filter(item=> item.category.includes(searchInput) || item.product_name.includes(searchInput) || item.seller.name.includes(searchInput))
        else
             return products.filter(item=> (item.category.includes(searchInput) || item.product_name.includes(searchInput) || item.seller.name.includes(searchInput)) && item.category === category)
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