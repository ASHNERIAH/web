document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const roseContainer = document.querySelector('.rose-container');
    const detailsPanel = document.querySelector('.details-panel');
    const closeButton = document.querySelector('.close-button');
    const invitationCard = document.querySelector('.invitation-card');
    const giftCategories = document.querySelectorAll('.gift-category');
    const galleryGrid = document.getElementById('gallery-grid');
    const closeGallery = document.getElementById('close-gallery');
    
    // Track dragged cards
    const draggedCards = [];
    
    // Sample data for 18 names per category
    const categoryData = {
        'Roses': [
            'Emma', 'Sophia', 'Olivia', 'Ava', 'Isabella',
            'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn',
            'Abigail', 'Emily', 'Elizabeth', 'Sofia', 'Avery',
            'Ella', 'Scarlett', 'Grace'
        ],
        'Balloons': [
            'Liam', 'Noah', 'Oliver', 'William', 'Elijah',
            'James', 'Benjamin', 'Lucas', 'Mason', 'Ethan',
            'Alexander', 'Henry', 'Jacob', 'Michael', 'Daniel',
            'Logan', 'Jackson', 'Sebastian'
        ],
        'Candles & Wishes': [
            'Mom', 'Dad', 'Grandma', 'Grandpa', 'Aunt Sarah',
            'Uncle John', 'Cousin Emily', 'Cousin Jake', 'Godmother Lisa', 'Godfather Mark',
            'Teacher Ms. Rodriguez', 'Coach Williams', 'Neighbor Mrs. Chen', 'Family Friend David', 'Mentor Patricia',
            'Pastor Thomas', 'Childhood Friend Anna', 'Childhood Friend Miguel'
        ],
        'Shots': [
            'Best Friend Alex', 'Best Friend Jamie', 'Friend Taylor', 'Friend Jordan', 'Friend Casey',
            'Friend Riley', 'Friend Morgan', 'Friend Avery', 'Friend Quinn', 'Friend Dakota',
            'Friend Skyler', 'Friend Reese', 'Friend Parker', 'Friend Hayden', 'Friend Cameron',
            'Friend Drew', 'Friend Blake', 'Friend Jesse'
        ],
        'Blue Bills': [
            'Grandpa Joe', 'Grandma Rose', 'Uncle Robert', 'Aunt Mary', 'Uncle James',
            'Aunt Elizabeth', 'Uncle Michael', 'Aunt Susan', 'Uncle David', 'Aunt Patricia',
            'Uncle Thomas', 'Aunt Jennifer', 'Uncle Charles', 'Aunt Margaret', 'Uncle Joseph',
            'Aunt Barbara', 'Uncle Richard', 'Aunt Linda'
        ],
        'Teddy Bears': [
            'Cuddles', 'Fluffy', 'Snuggles', 'Honey', 'Coco',
            'Mocha', 'Brownie', 'Teddy', 'Bubbles', 'Gummy',
            'Peanut', 'Cookie', 'Marshmallow', 'Waffle', 'Biscuit',
            'Caramel', 'Vanilla', 'Chocolate'
        ],
        'Treasures': [
            'Diamond Necklace', 'Gold Bracelet', 'Silver Ring', 'Pearl Earrings', 'Ruby Pendant',
            'Sapphire Brooch', 'Emerald Charm', 'Amethyst Watch', 'Opal Hairpin', 'Topaz Anklet',
            'Jade Bangle', 'Amber Locket', 'Coral Tiara', 'Turquoise Medallion', 'Garnet Cufflinks',
            'Moonstone Keychain', 'Citrine Bookmark', 'Quartz Paperweight'
        ]
    };
    
    // Memory card data - updated to use local images
    const memories = [
        {
            id: 1,
            image: "images/494571265_658155350570398_7585472050152123017_n.jpg",
            rating: 5
        },
        {
            id: 2,
            image: "images/494574646_1095690199106498_1676759718715647950_n.jpg",
            rating: 5
        },
        {
            id: 3,
            image: "images/494575709_1256340932515780_3985337523308106693_n (1).jpg",
            rating: 5
        },
        {
            id: 4,
            image: "images/494579207_1338240677250315_5438049690571246404_n.jpg",
            rating: 5
        },
        {
            id: 5,
            image: "images/494819275_1068949611819733_6495006016772445978_n.jpg",
            rating: 5
        },
        {
            id: 6,
            image: "images/cs7rtn78ojeqrcu2t8ib5hppl8.png",
            rating: 5
        }
    ];
    
    // Function to show details panel
    function showDetails() {
        detailsPanel.classList.remove('hidden');
        
        // Add a slight delay before adding the show class for animation
        setTimeout(() => {
            detailsPanel.classList.add('show');
            
            // Animate in the gift categories one by one
            giftCategories.forEach((category, index) => {
                setTimeout(() => {
                    category.style.opacity = '1';
                    category.style.transform = 'translateY(0)';
                }, 100 * (index + 1));
            });
            
            // Initialize the card stack
            initCardStack();
        }, 50);
    }
    
    // Function to hide details panel
    function hideDetails() {
        detailsPanel.classList.remove('show');
        
        // Wait for animation to complete before hiding
        setTimeout(() => {
            detailsPanel.classList.add('hidden');
            
            // Reset gift categories for next time
            giftCategories.forEach(category => {
                category.style.opacity = '0';
                category.style.transform = 'translateY(20px)';
            });
        }, 500);
    }
    
    // Function to create and show the names modal
    function showNamesModal(categoryName, names) {
        // Remove any existing modal first
        const existingModal = document.querySelector('.names-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'names-modal';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'names-modal-content';
        
        // Add header
        const header = document.createElement('div');
        header.className = 'names-modal-header';
        
        const title = document.createElement('h2');
        title.textContent = categoryName;
        
        const closeModalBtn = document.createElement('span');
        closeModalBtn.className = 'names-modal-close';
        closeModalBtn.innerHTML = '&times;';
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
        
        header.appendChild(title);
        header.appendChild(closeModalBtn);
        
        // Add names list
        const namesList = document.createElement('div');
        namesList.className = 'names-list';
        
        names.forEach((name, index) => {
            const nameItem = document.createElement('div');
            nameItem.className = 'name-item';
            
            const nameNumber = document.createElement('span');
            nameNumber.className = 'name-number';
            nameNumber.textContent = (index + 1) + '.';
            
            const nameText = document.createElement('span');
            nameText.className = 'name-text';
            nameText.textContent = name;
            
            nameItem.appendChild(nameNumber);
            nameItem.appendChild(nameText);
            namesList.appendChild(nameItem);
        });
        
        // Assemble modal
        modalContent.appendChild(header);
        modalContent.appendChild(namesList);
        modal.appendChild(modalContent);
        
        // Add to body
        document.body.appendChild(modal);
        
        // Trigger animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
    
    // Add click event to each gift category
    giftCategories.forEach(category => {
        category.addEventListener('click', function() {
            const categoryTitle = this.querySelector('h3').textContent;
            const names = categoryData[categoryTitle];
            if (names) {
                showNamesModal(categoryTitle, names);
            }
        });
    });
    
    // Event listeners
    roseContainer.addEventListener('click', showDetails);
    closeButton.addEventListener('click', hideDetails);
    closeGallery.addEventListener('click', hideGalleryGrid);
    
    // Function to hide gallery grid
    function hideGalleryGrid() {
        galleryGrid.classList.remove('show');
    }
    
    // Function to create gallery items
    function createGalleryItems() {
        // Use all memories, including dragged ones
        memories.forEach(memory => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = memory.image;
            img.alt = "Memory";
            
            galleryItem.appendChild(img);
            galleryGrid.appendChild(galleryItem);
        });
    }
    
    // Initialize gift categories with opacity 0 for animation
    giftCategories.forEach(category => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(20px)';
        category.style.transition = 'all 0.5s ease';
        
        // Add a subtle hover effect to indicate they're clickable
        category.style.cursor = 'pointer';
    });
    
    // Add floating animation to the rose
    function floatingAnimation() {
        const rose = document.querySelector('.enchanted-rose');
        let position = 0;
        let direction = 1;
        
        setInterval(() => {
            position += 0.2 * direction;
            
            if (position >= 5 || position <= -5) {
                direction *= -1;
            }
            
            rose.style.transform = `translateY(${position}px)`;
        }, 50);
    }
    
    floatingAnimation();
    
    // Add shimmer effect to gold elements
    function addShimmerEffect() {
        const goldElements = document.querySelectorAll('.title, .celebrant, .age, .gift-category h3');
        
        goldElements.forEach(element => {
            const shimmer = document.createElement('div');
            shimmer.className = 'shimmer';
            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            
            // Create and append the shimmer element
            const shimmerStyle = document.createElement('style');
            shimmerStyle.textContent = `
                .shimmer {
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        rgba(255, 255, 255, 0) 0%,
                        rgba(255, 255, 255, 0.2) 50%,
                        rgba(255, 255, 255, 0) 100%
                    );
                    animation: shimmer 3s infinite;
                    pointer-events: none;
                }
                
                @keyframes shimmer {
                    0% { left: -100%; }
                    100% { left: 200%; }
                }
            `;
            document.head.appendChild(shimmerStyle);
            
            element.appendChild(shimmer);
        });
    }
    
    addShimmerEffect();
    
    // Prevent scrolling on mobile when not needed
    document.body.addEventListener('touchmove', function(e) {
        if (!detailsPanel.classList.contains('show')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Add petal falling animation
    function createPetalFall() {
        const container = document.querySelector('.invitation-card');
        const numPetals = 15;
        
        for (let i = 0; i < numPetals; i++) {
            const petal = document.createElement('div');
            petal.className = 'rose-petal';
            
            // Random position and animation properties
            const size = Math.random() * 10 + 5;
            petal.style.width = `${size}px`;
            petal.style.height = `${size * 1.5}px`;
            petal.style.left = `${Math.random() * 100}%`;
            petal.style.animationDuration = `${Math.random() * 5 + 5}s`;
            petal.style.animationDelay = `${Math.random() * 5}s`;
            
            // Create and append the petal style
            const petalStyle = document.createElement('style');
            petalStyle.textContent = `
                .rose-petal {
                    position: absolute;
                    top: -20px;
                    background-color: var(--rose-red);
                    border-radius: 50% 0 50% 0;
                    opacity: 0.7;
                    z-index: 1;
                    animation: fall linear infinite;
                    pointer-events: none;
                }
                
                @keyframes fall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 0.7;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(petalStyle);
            
            container.appendChild(petal);
        }
    }
    
    createPetalFall();
    
    // Card Stack Functions
    let cardStackInitialized = false;
    
    function initCardStack() {
        if (cardStackInitialized) return;
        
        const cardStack = document.getElementById('card-stack');
        const cardRating = document.getElementById('card-rating');
        
        // Create cards
        memories.forEach((memory, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.id = memory.id;
            card.style.zIndex = memories.length - index;
            
            // Position cards in a stack
            const offset = index * 5;
            card.style.transform = `translateY(${offset}px) scale(${1 - index * 0.05})`;
            card.style.opacity = index === 0 ? 1 : 1 - index * 0.2;
            
            const img = document.createElement('img');
            img.src = memory.image;
            img.alt = "Memory";
            img.draggable = false;
            
            card.appendChild(img);
            cardStack.appendChild(card);
        });
        
        // Update rating stars for the first card
        updateCardRating(0);
        
        // Initialize drag functionality
        initDrag();
        
        cardStackInitialized = true;
    }
    
    // Update card rating in the footer
    function updateCardRating(index) {
        const memory = memories[index];
        
        // Update rating stars
        const stars = document.querySelectorAll('#card-rating .star');
        stars.forEach((star, i) => {
            if (i < memory.rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
    
    // Initialize drag functionality
    function initDrag() {
        const cards = document.querySelectorAll('.memory-card');
        let startY, startX;
        let isDragging = false;
        let currentCard = null;
        let initialTransform = '';
        
        cards.forEach(card => {
            card.addEventListener('mousedown', startDrag);
            card.addEventListener('touchstart', startDrag);
        });
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
        
        function startDrag(e) {
            if (isDragging) return;
            
            // Only allow dragging the top card
            if (parseInt(this.style.zIndex) !== memories.length) return;
            
            e.preventDefault();
            isDragging = true;
            currentCard = this;
            initialTransform = currentCard.style.transform;
            
            // Get starting position
            if (e.type === 'touchstart') {
                startY = e.touches[0].clientY;
                startX = e.touches[0].clientX;
            } else {
                startY = e.clientY;
                startX = e.clientX;
            }
            
            currentCard.style.transition = 'none';
        }
        
        function drag(e) {
            if (!isDragging || !currentCard) return;
            
            let currentX, currentY;
            if (e.type === 'touchmove') {
                currentY = e.touches[0].clientY;
                currentX = e.touches[0].clientX;
            } else {
                currentY = e.clientY;
                currentX = e.clientX;
            }
            
            const deltaY = currentY - startY;
            const deltaX = currentX - startX;
            
            // Move the card
            currentCard.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${deltaX * 0.1}deg)`;
        }
        
        function endDrag(e) {
            if (!isDragging || !currentCard) return;
            
            isDragging = false;
            currentCard.style.transition = 'all 0.5s ease';
            
            let currentX;
            if (e.type === 'touchend') {
                currentX = e.changedTouches[0].clientX;
            } else {
                currentX = e.clientX;
            }
            
            const deltaX = currentX - startX;
            
            // If dragged far enough, mark as dragged
            if (Math.abs(deltaX) > 100) {
                // Get the card ID
                const cardId = parseInt(currentCard.dataset.id);
                
                // Add to dragged cards if not already there
                if (!draggedCards.includes(cardId)) {
                    draggedCards.push(cardId);
                }
                
                // Mark card as dragged
                currentCard.classList.add('dragged');
                
                // Move card off screen and then hide it
                const direction = deltaX > 0 ? 1 : -1;
                currentCard.style.transform = `translate(${direction * 300}px, 0) rotate(${direction * 30}deg)`;
                currentCard.style.opacity = '0';
                
                // After animation, update cards
                setTimeout(() => {
                    // Find the next visible card
                    let nextCardId = null;
                    
                    // Update all cards' z-index
                    const cards = document.querySelectorAll('.memory-card');
                    cards.forEach(card => {
                        // Skip dragged cards
                        if (card.classList.contains('dragged')) {
                            return;
                        }
                        
                        const zIndex = parseInt(card.style.zIndex);
                        if (zIndex < memories.length) {
                            card.style.zIndex = zIndex + 1;
                            
                            // Update position based on new z-index
                            const newIndex = memories.length - card.style.zIndex;
                            const offset = newIndex * 5;
                            card.style.transform = `translateY(${offset}px) scale(${1 - newIndex * 0.05})`;
                            card.style.opacity = newIndex === 0 ? 1 : 1 - newIndex * 0.2;
                            
                            // If this is the new top card, update rating
                            if (card.style.zIndex == memories.length) {
                                nextCardId = parseInt(card.dataset.id);
                            }
                        }
                    });
                    
                    // Update rating for the next card
                    if (nextCardId !== null) {
                        const index = memories.findIndex(m => m.id === nextCardId);
                        updateCardRating(index);
                    }
                }, 500);
            } else {
                // Return to original position
                currentCard.style.transform = initialTransform;
            }
            
            currentCard = null;
        }
    }
}); 