export const storageUtils = { 
    saveCV: (docTitle: string, content: any) => { 
        try { 
            const data = { 
                docTitle, 
                content, 
                savedAt: new Date().toISOString(), 
            }; 
            localStorage.setItem('cvData', JSON.stringify(data)); 
            return true; 
        } catch (error) { 
            console.error('Failed to save CV:', error); 
            return false; 
        } 
    }, 
    getCV: () => { 
        try { 
            const data = localStorage.getItem('cvData'); 
            return data ? JSON.parse(data) : null; 
        } catch (error) { 
            console.error('Failed to retrieve CV:', error); 
            return null; 
        } 
    }, 
    clearCV: () => { 
        try { 
            localStorage.removeItem('cvData'); 
            return true; 
        } catch (error) { 
            console.error('Failed to clear CV:', error); 
            return false; 
        } 
    }, 
    hasCV: () => { 
        try { 
            return localStorage.getItem('cvData') !== null; 
        } catch (error) { 
            return false; 
        } 
    }, 
};