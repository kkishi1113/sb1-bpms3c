'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
// import Image from 'next/image';

export default function DialogWithCarouselComponent() {
  const slides = [
    {
      id: 1,
      title: 'Minimalist Water Bottle',
      description: 'Stay hydrated with our sleek, eco-friendly water bottle.',
      image: '/placeholder.svg?height=400&width=400',
    },
    {
      id: 2,
      title: 'Smart Home Hub',
      description: 'Control your entire home with our intuitive smart home system.',
      image: '/placeholder.svg?height=400&width=400',
    },
    {
      id: 3,
      title: 'Wireless Earbuds',
      description: 'Immerse yourself in crystal-clear audio with our latest earbuds.',
      image: '/placeholder.svg?height=400&width=400',
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
      <Dialog>
        <Button variant="outline" className="bg-white text-gray-800 hover:bg-gray-100 border-gray-300" asChild>
          <DialogTrigger>Open Product Showcase</DialogTrigger>
        </Button>
        <DialogContent className="max-w-full w-screen h-screen p-0 m-0 bg-gradient-to-br from-gray-800 to-gray-900">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
            <Carousel className="w-full h-full max-w-[80%] max-h-[80%]">
              <CarouselContent>
                {slides.map((slide) => (
                  <CarouselItem key={slide.id}>
                    <Card className="bg-gray-700/30 backdrop-blur-md border-0 shadow-xl h-full">
                      <CardContent className="flex flex-col md:flex-row items-center justify-center p-6 h-full">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          width={300}
                          height={300}
                          className="rounded-lg mb-4 md:mb-0 md:mr-6 object-cover"
                        />
                        <div className="text-center md:text-left max-w-md">
                          <h2 className="text-2xl font-bold mb-2 text-white">{slide.title}</h2>
                          <p className="text-lg text-gray-300">{slide.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 md:-left-12 bg-white/10 hover:bg-white/20 text-white" />
              <CarouselNext className="right-4 md:-right-12 bg-white/10 hover:bg-white/20 text-white" />
            </Carousel>
          </div>
          <Button className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white" variant="ghost" asChild>
            <DialogClose>Close</DialogClose>
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
