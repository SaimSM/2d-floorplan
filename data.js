const floorplanData = {
    regions: [
        { start: { x: 50, y: 50 }, end: { x: 750, y: 50 } },
        { start: { x: 750, y: 50 }, end: { x: 750, y: 550 } },
        { start: { x: 750, y: 550 }, end: { x: 50, y: 550 } },
        { start: { x: 50, y: 550 }, end: { x: 50, y: 50 } },
    ],
    doors: [
        { location: { x: 400, y: 50 }, width: 50, rotation: 0 }
    ],
    furnitures: [
        { equipName: 'Chair', minBound: { x: 100, y: 100 }, maxBound: { x: 150, y: 150 }, rotation: 0 },
        { equipName: 'Table', minBound: { x: 300, y: 300 }, maxBound: { x: 400, y: 350 }, rotation: 0 }
    ]
};
