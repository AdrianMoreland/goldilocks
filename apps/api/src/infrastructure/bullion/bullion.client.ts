import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';


@Injectable()
export class BullionClient {

    private readonly logger = new Logger(BullionClient.name);


    async fetchPrices() {

        const { data: html } = await axios.get(
            'https://www.bullionbypost.ie/gold-price/live-gold-price/',
            {
                headers: {
                    'User-Agent':
                        'Mozilla/5.0'
                }
            }
        );


        const $ = cheerio.load(html);


        const text = $('body').text();


        this.logger.debug(text.substring(0,500));


        return {
            GOLD: this.extract(text, 'Gold Price'),
            SILVER: this.extract(text, 'Silver Price'),
        };
    }


    private extract(
        html: string,
        label: string
    ) {

        const regex = new RegExp(
            `${label}\\s+€([0-9,.]+)`
        );


        const match = html.match(regex);


        if (!match) {
            return null;
        }


        return Number(
            match[1]
                .replace(',', '')
        );
    }
}