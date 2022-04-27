
//Filter data based on category and search input value 
export const filterDataByCategory = (products, category, searchInput) =>{
    //TODO add search by location: item.seller.location.includes(searchInput)
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