// gemini.service.ts
import { Injectable } from '@nestjs/common';
import { MoviesService } from '../movies/movies.service';
import { ProductsService } from '../products/products.service';
import { CinemasService } from '../cinemas/cinemas.service';

@Injectable()
export class GeminiService {
  private readonly apiKey = process.env.GEMINI_API_KEY;
  // Use v1 endpoint with a public model that supports generateContent
  private readonly apiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  constructor(
    private readonly moviesService: MoviesService,
    private readonly productsService: ProductsService,
    private readonly cinemasService: CinemasService,
  ) {}

  async chat(
    message: string,
    history: Array<{ role: string; content: string }> = [],
  ) {
    const contents: Array<{
      role: string;
      parts: Array<{ text: string }>;
    }> = [];

    // Fetch movies, products and cinemas data
    const movies = await this.moviesService.findAll();
    const products = await this.productsService.findAll();
    const cinemas = await this.cinemasService.findAll();

    const productsData = products.map((p) => ({
      id: p.product_id,
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
    }));

    const cinemasData = cinemas.map((c) => ({
      id: c.cinema_id,
      name: c.name,
      address: c.address,
      room_count: c.room_count,
    }));

    contents.push({
      role: 'user',
      parts: [
        {
          text: `You are a helpful cinema assistant for "Absolute Cinema". 
You help customers with:
- Movie information and recommendations
- Showtimes and booking assistance
- Cinema locations and facilities
- Ticket pricing and promotions
- General cinema-related questions

Here is our current movie catalog:
${JSON.stringify(movies, null, 2)}

Here are our available products (snacks, drinks, etc.):
${JSON.stringify(productsData, null, 2)}

Here are our cinema locations:
${JSON.stringify(cinemasData, null, 2)}

Please provide friendly, concise, and helpful responses.
Use the movie, product and cinema data above to give accurate information.
If you don't know something specific about our cinema, be honest and suggest contacting customer service.`,
        },
      ],
    });

    contents.push({
      role: 'model',
      parts: [{ text: 'I understand. How can I help?' }],
    });

    history.slice(-4).forEach((h) => {
      contents.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      });
    });

    contents.push({ role: 'user', parts: [{ text: message }] });

    const res = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Gemini API failed ${res.status}: ${errorText || res.statusText}`,
      );
    }

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      // log entire response to debug empty reply cases
      console.warn('Gemini empty reply', data);
      throw new Error('Gemini did not return a reply');
    }

    return reply;
  }
}
