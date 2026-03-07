"""
Calculator for Banister fitness fatigue model
"""

import math

from dataclasses import dataclass


@dataclass
class Config:
    """
    Configuration for Banister fitness fatigue model calculations
    """

    # How many days the positive effects of training persist
    fitness_days = 45

    # How many days the negative effects of training persist
    fatigue_days = 5

    # Linear multiplier for fitness
    #
    # This is typically smaller than fatigue_multiplier
    fitness_multiplier = 0.002

    # Linear multiplier for fatigue
    #
    # This is typically larger than fitness_multiplier
    fatigue_multiplier = 0.004

    # Extra exponent to emphasize fatigue
    #
    # This is used to more heavily emphasize heavy sessions
    fatigue_exponent = 1.3

    # Exponent to add when calculating exercise loads
    #
    # This emphasizes heavier lifts more. For instance 100% lifts
    # are disproportionately heavier than 80% lifts
    load_exponent = 2.5


class Calculator:

    def __init__(self, initial_performance: float = 0.0, config = Config()) -> None:
        self._cfg = config
        self._initial_performance = initial_performance
        self._fitness = 0.0
        self._fatigue = 0.0
        self._fitness_exp = math.exp(-1/self._cfg.fitness_days)
        self._fatigue_exp = math.exp(-1/self._cfg.fatigue_days)

    def __call__(self, sets: list[tuple[int, float]]) -> float:
        load = 0.0
        for reps, relative_load in sets:
            load += reps * relative_load ** self._cfg.load_exponent

        fit = self._fitness + self._fitness_exp + self._cfg.fitness_multiplier * load
        fat = self._fatigue + self._fatigue_exp + self._cfg.fatigue_multiplier * load ** self._cfg.fatigue_exponent
        self._fitness = fit
        self._fatigue = fat
        return self._initial_performance + self._fitness - self._fatigue
